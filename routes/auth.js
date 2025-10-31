const express = require('express');
const router = express.Router();
const User = require('../models/User');


// Register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
  
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format',
        toast: {
          message: 'Please enter a valid email address',
          type: 'danger'
        }
      });
    }
  
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
        toast: {
          message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
          type: 'danger'
        }
      });
    }
  
    const user = new User({ name, email, password });
    await user.save();
    res.json({ 
      success: true,
      toast: {
        message: 'Registration successful!',
        type: 'success'
      }
    });
  });
  

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (user) {
        req.session.user = {
            _id: user._id,
            email: user.email,
            name: user.name
        };
        res.cookie('userSession', req.session.user);
        console.log(' Session object:', req.session);
        console.log(' Cookies received:', req.cookies);

        res.json({ 
          success: true, 
          user: req.session.user,
          toast: {
            message: 'Login successful!',
            type: 'success'
          }
        });
    } else {
        res.json({ 
          success: false, 
          message: 'Invalid credentials',
          toast: {
            message: 'Invalid email or password',
            type: 'danger'
          }
        });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ 
          message: 'Logout failed',
          toast: {
            message: 'Logout failed. Please try again.',
            type: 'danger'
          }
        });
        res.clearCookie('userSession');
        res.json({ 
          success: true, 
          message: 'Logged out successfully',
          toast: {
            message: 'Logged out successfully',
            type: 'success'
          }
        });
    });
});



module.exports = router;
