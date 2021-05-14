const cors = require("cors")
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const MentorsData = [
    {
      _id: 1,
      name: "Mentor 1",
      email: "mentor1@example.com",
      
    },
    {
      _id: 2,
      name: "Mentor 2",
      email: "mentor2@example.com",
      
    },
    {
      _id: 3,
      name: "Mentor 3",
      email: "mentor3@example.com",
      
    },
  ];
  const StudentsData = [
    {
      _id: 1,
      name: "Student 1",
      email: "student1@example.com",
      mentor_id:"1",
    },
    {
      _id: 2,
      name: "Student 2",
      email: "student2@example.com",
      
    },
    {
      _id: 3,
      name: "Student 3",
      email: "student3@example.com",
      
    },
  ];


app.use(express.json());
app.use(cors());


app.get("/",(req,res)=>{
    res.json({
        "Title": "Student-Mentor api endpoints reference",
        });
    res.end();
});


app.post("/add-a-student", async(req, res)=>{
    try{
        
      let data =  {
            _id: StudentsData.length+1,
            name: req.body.name,
            email: req.body.email,
            
          }
          StudentsData.push(data)
          
        res.status(200).json({
            message :"Student record inserted"
        })
       
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "Error while adding the student"
        })
    }
});

app.post("/add-a-mentor", async(req, res)=>{
    try{
        let data ={
            _id: MentorsData.length+1,
            name: req.body.name,
            email: req.body.email,
            
          }
          MentorsData.push(data)
        
        res.status(200).json({
            message :"mentor record inserted"
        })
       
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "Error while adding the mentor"
        })
    }
});

app.put("/assign-students-for-a-mentor/", async(req, res)=>{
    let mentorId = req.body.mentorId;
    let id = req.body.studentId;
    let studentId = id.map(val => +val);
  
    try{
        
let query=[]
  for( let item of StudentsData)
  {
      for(let elm of studentId)
      {
      if(item._id==elm)
          {
            query.push(item._id)
            item.mentor_id=mentorId
          }
      }
  }
  console.log(StudentsData)
  
        res.status(200).json({
            message : "updated the records !!",
            data : query
        })
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "error updating the records",
            data: error.message
        })
    }
});



app.put("/change-mentor-for-a-student", async(req, res)=>{
    
    let studentId = req.body.studentId;
    let mentorId = req.body.mentorId
    
    try{
        
        let flag=0
        for(let item of StudentsData)
        {
            if(item._id == studentId)
            {
                flag=1
                item.mentor_id=mentorId
            }
        }
        console.log(StudentsData)
        
        // if the objectId format is valid but if it is not available in the records, the below code snippet will be triggered
        if(flag==0){
            res.status(404).json({
                message : "id not found, error updating the records",
                data : false
            }) 
        }


        res.status(200).json({
            message : "updated the records !!",
            data : true
        })
       
    }
    // if the objectId foramt is NOT VALID, the below code snippet will be triggered
    catch(error)
    {
        res.status(404).json({
            message: "id not found, error updating the records",
            data: false
        })
    }
});

app.get("/list-of-students-for-a-mentor/:mentorId", async(req, res)=>{
    let mentorId = req.params.mentorId
    console.log(mentorId)
    try{
        
        let query = StudentsData.filter(stu=>stu.mentor_id==mentorId)
        console.log(query.length)
        res.status(200).json({
            "data" : query
        })
       
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "Could not find any students for the mentor id: "+ mentorId,
            data: error.message
        })
    }
});

app.get("/all-students-mentors/:condition", async(req, res)=>{
   let mentorId = +req.body.mentorId
    try{
        let studentQuery;
        if(req.params.condition == 'unassigned'){
        studentQuery  = await pendingStudents();
        }else{
        studentQuery = StudentsData
        }
        let mentorQuery = MentorsData
        
        res.status(200).json({
            students : studentQuery,
            mentors: mentorQuery
        })
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "Could not find any students for the mentor id: "+ mentorId,
            data: error.message
        })
    }
});


async function pendingStudents(){
       let result = StudentsData.filter(stu=>stu.mentor_id==undefined)
        console.log(result);
        return result;
};


app.listen(PORT,()=>console.log(`Student-Mentor Api server is running at port ${PORT}`))