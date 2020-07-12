//modulo para salvar arquivos no filesystem
const fs = require('fs')
const data = require('./data.json');
const { url } = require('inspector');
const { resolveNaptr } = require('dns');
const { create } = require('browser-sync');

exports.post = function(req, res){
    
    const keys = Object.keys(req.body);

    for (key of keys){
    
        if(req.body[key]==""){
            return res.send("Please fill all fields!");
        }
    }

    let { avatar_url, birth, name, services, gender } = req.body
    
    birth = Date.parse(req.body.birth);
    const created_at = Date.now();
    const id = Number(data.instructors.length + 1)


    

    data.instructors.push({
        id,
        name,
        avatar_url, 
        birth, 
        created_at, 
        services, 
        gender
});
   

    fs.writeFile('./data.json', JSON.stringify(data, null, 4), function(err){
        if (err) return res.send("Um erro ocorreu ao gravar o formulário");
    
        return res.redirect("instructors")
    })
    
}

exports.show = function(req, res){
    const { id } = req.params;
    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id;
    })

    if (!foundInstructor){
        res.send("Instructor Not found");
    }

    let timestamp = foundInstructor.birth;
    function age(timestamp){
        const today = new Date();
        const birthdate = new Date(timestamp);

        let age = today.getFullYear() - birthdate.getFullYear();
        if 

    }

    const instructor = {
        ...foundInstructor,
        "age" : "",
        "services" : foundInstructor.services.split(","),
        "created_at" : ""
    }

    return res.render("instructors/show", {instructor});
}