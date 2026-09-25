const express = require('express')
const auth = require('../middleware/auth') // Requirement 3: Protect this route
const Task = require('../models/Task')
const router = express.Router()

// @route GET /api/tasks - Get only tasks for logged-in user (Requirement 4)
router.get('/', auth, async(req,res)=>{
  try {
    // Find tasks where user = logged-in user id from token
    const tasks = await Task.find({user: req.user})
    res.json(tasks)
  } catch(err){
    res.status(500).json({msg: err.message})
  }
})

// @route POST /api/tasks - Create task for logged-in user
router.post('/', auth, async(req,res)=>{
  try {
    const newTask = new Task({
      title: req.body.title,
      user: req.user // Associate task with user id from JWT (Requirement 4)
    })
    const task = await newTask.save()
    res.json(task)
  } catch(err){
    res.status(500).json({msg: err.message})
  }
})

// @route DELETE /api/tasks/:id - Delete own task
router.delete('/:id', auth, async(req,res)=>{
  try {
    const task = await Task.findById(req.params.id)
    if(!task) return res.status(404).json({msg: "Task not found"})
    if(task.user.toString() !== req.user) return res.status(401).json({msg: "Not authorized"})

    await Task.findByIdAndDelete(req.params.id)
    res.json({msg: "Task deleted"})
  } catch(err){
    res.status(500).json({msg: err.message})
  }
})
// @route PUT /api/tasks/:id - Edit task
router.put('/:id', auth, async(req,res)=>{
  try {
    const task = await Task.findById(req.params.id)
    if(!task) return res.status(404).json({msg: "Task not found"})
    if(task.user.toString() !== req.user) return res.status(401).json({msg: "Not authorized"})

    task.title = req.body.title || task.title
    await task.save()
    res.json(task)
  } catch(err){
    res.status(500).json({msg: err.message})
  }
})

module.exports = router