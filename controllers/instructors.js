//modulo para salvar arquivos no filesystem
const { age, date } = require('../utils');
const fs = require('fs')
const data = require('../data.json');
const { url } = require('inspector');
const { resolveNaptr } = require('dns');
const { create } = require('browser-sync');


exports.create = function(req, res){
    return res.render("./instructors/create");
}

exports.index = function(req, res){
    return res.render("./instructors/index", {instructors: data.instructors})

}

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

    const instructor = {
        ...foundInstructor,
        "age" : age(foundInstructor.birth),
        "services" : foundInstructor.services.split(","),
        "created_at" : Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at)
    }

    return res.render("instructors/show", {instructor});
}

exports.edit = function(req, res){
    
    const { id } = req.params;
    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id;
    })

    if (!foundInstructor){
        res.send("Instructor Not found");
    }

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso
    }
    
    date(foundInstructor.birth);

    return res.render("instructors/edit", {instructor});

}

exports.put = function(req, res){
    
    const { id } = req.body;
    let index = 0;
    const foundInstructor = data.instructors.find(function(instructor, foundIndex){
        if(id == instructor.id) {
            index = foundIndex;
            return true
        }
    })

    if (!foundInstructor){
        return res.send("Instructor Not found");
    }

    const instructor = {
        ...foundInstructor,
        ...req.body,
        ...birth = Date.parse(req.body.birth),
        id: Number(req.body.id)
    }
    console.log(instructor);
    data.instructors[index] = instructor;
    fs.writeFile('./data.json', JSON.stringify(data, null, 4), function(err){
        if (err) return res.send("Um erro ocorreu ao gravar o formulário");
    
        return res.redirect(`/instructors/${id}`);
    })
    
}

exports.delete = function(req, res){

    const { id } = req.body;
    const filteredInstructors = data.instructors.filter(function(instructor){

        return instructor.id != id;
    });

    data.instructors = filteredInstructors


    fs.writeFile('./data.json', JSON.stringify(data, null, 4), function(err){
        if (err) return res.send("Um erro ocorreu ao gravar o formulário");
    
        return res.redirect(`/instructors`);
    });
}