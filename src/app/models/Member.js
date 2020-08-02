const db = require('../../config/db');
const { age, date } = require('../../lib/utils');

module.exports = {
    all(callback){
        db.query(`SELECT * FROM members`, function(err, results){
            if (err) throw `Database error ${err}`;
            
            callback(results.rows);
        })

    },
    create(data, callback){
        
        const query = `
        
            INSERT INTO members (avatar_url, name, email, gender, birth, blood, weight, height, instructor_id) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;
        
        `
        const values = [
            data.avatar_url,
            data.name,
            data.email,
            data.gender,
            date(data.birth).iso,
            data.blood,
            data.weight,
            data.height,
            data.instructor
        ]
        db.query(query, values, function(err, results){
            if (err) throw `Database error ${err}`;


            callback(results.rows[0]);
        });
    },
    getbyid(id, callback){

        const query = `
        
        SELECT members.*, instructors.name as instructor_name
        FROM members
        LEFT JOIN instructors ON (members.instructor_id = instructors.id)
        WHERE members.id = ${id}  
        
        `
        db.query(query,function(err, results){
            if (err) throw `Database error ${err}`;
            callback(results.rows[0]);
        });

    },
    update(data, callback){
        const query = `
            UPDATE members SET
                avatar_url=($1),
                name=($2),
                email=($3),
                gender=($4),
                birth=($5),
                blood=($6),
                weight=($7),
                height=($8),
                instructor_id=($9)
                WHERE id=($10)
        `
        const values = [
            data.avatar_url,
            data.name,
            data.email,
            data.gender,
            date(data.birth).iso,
            data.blood,
            data.weight,
            data.height,
            data.instructor,
            data.id,
            
        ]
        db.query(query, values, function(err, results){
            if (err) throw `Database error ${err}`;

            callback();
        })
    },
    delete(id, callback){
        db.query(`DELETE FROM members WHERE id=$1`, [id], function(err, results){
            if (err) throw `Database error ${err}`;
            return callback()
        });
    },
    instructorsSelectOptions(callback){
        db.query(`SELECT id, name FROM instructors`, function(err, results){
            if (err) throw `Database error ${err}`;
            callback(results.rows);
        });
        
    },
    paginate(params){
        const { filter, limit, offset, callback } = params


        let query = '',
            queryFilter = '',
            totalQuery = `(SELECT count(*) FROM members) AS total`

        if (filter) {


            queryFilter = ` WHERE members.name ILIKE '%${filter}%'
                            OR members.email ILIKE '%${filter}%'
            
                        `
            
            totalQuery = `( SELECT count(*) FROM members ${queryFilter}) AS total`
        }

        query = `SELECT members.*, ${totalQuery} 
                 FROM members
                 ${queryFilter}
                 LIMIT $1 OFFSET $2
            `
        db.query(query, [limit, offset], function (err, results) {
            if (err) throw "Database Error";

            callback(results.rows);
            
        });
    }

}