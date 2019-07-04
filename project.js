import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import Sequelize from 'sequelize'
import bcrypt from 'bcrypt'

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const sequelize = new Sequelize('management', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });

  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


dotenv.config()
app.post('/member/signin',async (req,res)=>{
    let result = await sequelize.query(`Select password from member where email='${req.body.name}' OR mobile='${req.body.name}'`)
    if(result[0].length==0){
      res.send("name is invalid!")
    }
    else{
      let hash = result[0][0]['password']
      bcrypt.compare(req.body.password, hash, async function(err, response) {
        res.json(response)
      });
    }
  
  
  
  })
  

app.get('/project',async (req,res)=>{
    let result = await sequelize.query("Select * from project")
    res.json(result[0])
})

app.post('/project',async (req,res)=>{
    let result = await sequelize.query(`Insert into project values(null,'${req.body.name}','${req.body.startdate}','${req.body.daysalloted}')`)
    res.json(result)
})
app.get('/member',async (req,res)=>{
    let result = await sequelize.query("Select * from member")
    res.json(result[0])
})

app.post('/member',async (req,res)=>{
    console.log(process.env.SALTROUNDS)
    bcrypt.hash(req.body.password, parseInt(process.env.SALTROUNDS), async function(err, hash) {
      if(err){
        res.send(err)
        console.log(err)
        return
      }
    let result = await sequelize.query(`Insert into member values(null,'${req.body.name}','${req.body.mobile}','${req.body.email}','${hash}')`)
    res.json(result)
    });
})
app.get('/project_member',async (req,res)=>{
    let query = `Select project.name as 'project_name', member.name as 'member_name' FROM project,member, member_project
    where member_project.p_id = project.p_id AND member_project.m_id = member.m_id`

    let response = await sequelize.query(query)
    res.json(response)
})
app.get('/alloted_time',async (req,res)=>{
    let result = await sequelize.query("Select * from member_project")
    res.json(result[0])
})
app.get('/task',async (req,res)=>{
    let result = await sequelize.query("Select * from task")
    res.json(result)
})

app.post('/task',async (req,res)=>{
    let result = await sequelize.query(`Insert into task values(null,'${req.body.name}','${req.body.allottedto}','${req.body.allottedby}','${req.body.p_id}','${req.body.type}','${req.body.points}')`)
    res.json(result)
})
app.get('/subtask',async (req,res)=>{
    let result = await sequelize.query("Select * from subtask")
    res.json(result[0])
})

app.post('/subtask',async (req,res)=>{
    let result = await sequelize.query(`Insert into subtask values(null,'${req.body.name}','${req.body.description}','${req.body.allottedto}','${req.body.allottedby}','${req.body.points}','${req.body.t_id}')`)
    res.json(result)
})
app.get('/gettask',async (req,res)=>{
    let query = `Select * FROM task,subtask
    where subtask.t_id=task.t_id`
    let response = await sequelize.query(query)
    res.json(response)
})

app.get('/allotted_by',async (req,res)=>{
    let query = `Select project.name as 'project_name',member.name as 'member_allotted_by' FROM project,task,member
WHERE task.p_id=project.p_id AND task.allottedby=member.m_id `

    let response = await sequelize.query(query)
    res.json(response)
})
app.get('/allotted_to',async (req,res)=>{
    let query = `Select project.name as 'project_name',member.name as 'member_allotted_to' FROM project,task,member
WHERE task.p_id=project.p_id AND task.allottedto=member.m_id `

    let response = await sequelize.query(query)
    res.json(response)
})
app.get('/sprint',async (req,res)=>{
    let result = await sequelize.query("Select * from sprint")
    res.json(result[0])
})

app.post('/sprint',async (req,res)=>{
    let result = await sequelize.query(`Insert into sprint values(null,'${req.body.name}','${req.body.days}','${req.body.startdate}','${req.body.enddate}')`)
    res.json(result)
})
app.get('/sprinttask',async (req,res)=>{
    let query = `Select * FROM task,sprint,task_sprint
WHERE task_sprint.sprint_id=sprint.sprint_id AND task_sprint.t_id=task.t_id`

    let response = await sequelize.query(query)
    res.json(response)
})
app.listen(process.env.PORT,()=>{
    console.log("Server Started")
})
