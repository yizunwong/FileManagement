import pkg from 'jsonwebtoken'
const { sign } = pkg
import { db } from '../config/firebase.js'
import bcryptjs from 'bcryptjs'
const { compare, hash } = bcryptjs
import jwt from 'jsonwebtoken'

export async function login(req, res) {
  const { username, password } = req.body

  try {
    // Fetch user from Firestore
    const snapshot = await db.collection('users').where('username', '==', username).get()

    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    // Extract user data from Firestore document
    const userDoc = snapshot.docs[0]
    const user = userDoc.data()

    // Verify password
    const isPasswordValid = await compare(password, user.hashedPassword)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    // Generate token
    const token = sign(
      { id: userDoc.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    )

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    // Respond with the token and user information
    res.json({
      message: 'Login successful',
      token,
      user: { id: userDoc.id, username: user.username, role: user.role },
    })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ error: 'Failed to log in' })
  }
}

export async function logout(req, res) {
  try {
    // Clear the authToken cookie
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    })

    // Send a success response
    res.status(200).json({ message: 'Logged out successfully.' })
  } catch (error) {
    console.error('Error during logout:', error)

    // Send an error response
    res.status(500).json({ message: 'Failed to log out. Please try again.' })
  }
}

export async function authenticate(req, res) {
  const token = req.cookies.authToken 

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Attach decoded user data to the request
    res.status(200).json({ message: 'Authenticated', user: req.user })
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message })
  }
}

export async function register(req, res) {
  const { username, email, password } = req.body

  try {
    // Check if username already exists
    const existingUserSnapshot = await db
      .collection('users')
      .where('username', '==', username)
      .get()

    if (!existingUserSnapshot.empty) {
      return res.status(400).json({ message: 'Username already exists.' })
    }

    // Check if email already exists
    const existingEmailSnapshot = await db.collection('users').where('email', '==', email).get()

    if (!existingEmailSnapshot.empty) {
      return res.status(400).json({ message: 'Email already exists.' })
    }

    // Hash the password
    const hashedPassword = await hash(password, 10) // 10 is the salt rounds

    // Save user to Firestore
    const newUserRef = await db.collection('users').add({
      username,
      email,
      hashedPassword,
      role: 'user', // Default role
      createdAt: new Date(),
    })

    const user = { id: newUserRef.id, username, email, role: 'user' }

    res.status(201).json({ message: 'User registered successfully', user })
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ message: 'Failed to register user' })
  }
}

export async function fetchAllUsers(req, res) {
  try {
    // Fetch all users from the Firestore collection
    const snapshot = await db.collection('users').get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Extract the user ID from the request (assume it's passed in req.user or req.query)
    const requestingUserId = req.query.userId;

    // Map and filter out the requesting user's data
    const users = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((user) => user.id !== requestingUserId);

    if (users.length === 0) {
      return res.status(404).json({ message: 'No other users found' });
    }

    res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}


export async function fetchUserEmailById(req, res) {
  const { userId } = req.params // Get userId from the URL parameters

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Fetch the user document by ID
    const userDoc = await db.collection('users').doc(userId).get()

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' })
    }

    const userData = userDoc.data()

    // Respond with the user's email
    res.status(200).json({
      message: 'User fetched successfully',
      email: userData.email,
    })
  } catch (error) {
    console.error('Error fetching user email:', error)
    res.status(500).json({ error: 'Failed to fetch user email' })
  }
}

export default { login, logout, authenticate, register, fetchAllUsers }
