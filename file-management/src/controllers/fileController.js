import { db, bucket } from '../config/firebase.js'
import { Buffer } from 'buffer'
import admin from 'firebase-admin'

export async function uploadFile(req, res) {
  const { fileName, userId, overwrite, fileBase64, metadata } = req.body

  try {
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    let newFileName = fileName
    let filePath = `uploads/${userId}/${newFileName}` 

    // Check if the file exists
    let file = bucket.file(filePath)
    let [exists] = await file.exists()

    if (exists && !overwrite) {
      // If overwrite is false, generate a new name
      let suffix = 0
      const baseName = fileName.substring(0, fileName.lastIndexOf('.'))
      const extension = fileName.substring(fileName.lastIndexOf('.'))

      while (exists) {
        suffix++
        newFileName = `${baseName} (${suffix})${extension}`
        filePath = `uploads/${userId}/${newFileName}` 
        file = bucket.file(filePath)
        ;[exists] = await file.exists()
      }
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(fileBase64, 'base64')

    // Upload the file to Firebase Storage (overwriting or as a new file)
    await file.save(buffer, { contentType: metadata.type })

    // Generate a signed URL for the new file
    const [downloadURL] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    })

    // Update metadata in Firestore
    const fileData = {
      userId: userId,
      name: newFileName,
      url: downloadURL,
      type: metadata.type,
      size: metadata.size,
      uploadedAt: new Date(),
    }

    // Check if a metadata document already exists for this file name
    const snapshot = await db
      .collection('files')
      .where('name', '==', fileName)
      .where('userId', '==', userId)
      .get()
    if (!snapshot.empty && overwrite) {
      // Update the existing document if overwriting
      const docRef = snapshot.docs[0].ref
      await docRef.update(fileData)
    } else {
      // Add as a new document for new files or renamed files
      await db.collection('files').add(fileData)
    }

    res.status(200).json({ message: 'File uploaded successfully', fileData })
  } catch (error) {
    console.error('Error uploading file:', error)
    res.status(500).json({ error: 'Failed to upload file', details: error.message })
  }
}

// List All Files
export async function listAllFiles(req, res) {
  try {
    // Query the Firestore collection for all files
    const snapshot = await db.collection('files').get()

    const files = snapshot.empty
      ? []
      : snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

    res.status(200).json(files) 
  } catch (error) {
    console.error('Error fetching all files:', error)
    res.status(500).json({ error: 'Failed to fetch all files' })
  }
}

// List Files by User ID
export async function listFiles(req, res) {
  const { userId } = req.query 

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Query the Firestore collection for files where userId matches
    const snapshot = await db.collection('files').where('userId', '==', userId).get()

    // Return an empty array if no files are found
    const files = snapshot.empty
      ? []
      : snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

    res.status(200).json(files) 
  } catch (error) {
    console.error('Error fetching files:', error)
    res.status(500).json({ error: 'Failed to fetch files' })
  }
}

// List All Public Files
export async function listPublicFiles(req, res) {
  try {
    // Query the Firestore collection for files where isPublic is true
    const snapshot = await db.collection('files').where('isPublic', '==', true).get()

    const files = snapshot.empty
      ? [] 
      : snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

    res.status(200).json(files) 
  } catch (error) {
    console.error('Error fetching public files:', error)
    res.status(500).json({ error: 'Failed to fetch public files' })
  }
}

// List Files Shared with a Specific User
export async function listFilesSharedWithUser(req, res) {
  const { userEmail } = req.query 

  if (!userEmail) {
    return res.status(400).json({ message: 'User email is required' })
  }

  try {
    // Query the Firestore collection for files where sharedWith contains the user's email
    const snapshot = await db
      .collection('files')
      .where('sharedWith', 'array-contains', userEmail)
      .get()

    const files = snapshot.empty
      ? [] 
      : snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

    res.status(200).json(files) 
  } catch (error) {
    console.error('Error fetching shared files:', error)
    res.status(500).json({ error: 'Failed to fetch shared files' })
  }
}

// Delete File
export async function deleteFile(req, res) {
  const { id, userId } = req.params 

  try {
    const docRef = db.collection('files').doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return res.status(404).json({ error: 'File not found' })
    }

    const fileData = doc.data()

    // Construct the file path using userId
    const file = bucket.file(`uploads/${userId}/${fileData.name}`)
    await file.delete() 

    await docRef.delete() 

    res.status(200).json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Error deleting file:', error)
    res.status(500).json({ error: 'Failed to delete file' })
  }
}

// Share File
export async function shareFile(req, res) {
  const { id } = req.params 
  const { shareType, userEmail } = req.body 

  try {
    // Fetch the file metadata from Firestore
    const fileRef = db.collection('files').doc(id)
    const fileDoc = await fileRef.get()

    if (!fileDoc.exists) {
      return res.status(404).json({ error: 'File not found' })
    }

    // Update sharing metadata
    const updates = {}
    if (shareType === 'specific') {
      if (!userEmail) {
        return res.status(400).json({ error: 'User email is required for specific sharing' })
      }
      updates.isPublic = false

      // Add the user's email to the `sharedWith` array
      updates.sharedWith = admin.firestore.FieldValue.arrayUnion(userEmail)
    } else if (shareType === 'public') {
      updates.isPublic = true 
    } else if (shareType === 'private') {
      updates.isPublic = false
    } else {
      return res.status(400).json({ error: 'Invalid share type' })
    }

    // Save updates to Firestore
    await fileRef.update(updates)

    res.status(200).json({ message: 'File shared successfully' })
  } catch (error) {
    console.error('Error sharing file:', error)
    res.status(500).json({ error: 'Failed to share file', details: error.message })
  }
}
