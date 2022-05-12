        document.getElementById("exhibit-button").addEventListener("click", async () => {

            document.getElementById("exhibit-button").value = "Next Exhibit";
           
            const url ="https://zoo-animal-api.herokuapp.com/animals/rand";
            const json = await fetch(url).then(res=> res.json());
            
       
            
            let htmlToInsert = `<h2> Animal Name: ${json.name}</h2>
                                <image src="${json.image_link}" height = "400rem">
                                <br>
                                <br>
                                <strong>Animal Information: </strong>
                                <br>
                                <div id = "animalInfo"><strong>Latin Name: </strong>${json.latin_name} <br>
                                    <strong>Animal Type: </strong>${json.animal_type} <br>
                                    <strong>Active Time: </strong>${json.active_time} <br>
                                    <strong>Minimum Length: </strong>${json.length_min} feet<br>
                                    <strong>Maximum Length: </strong>${json.length_max} feet<br>
                                    <strong>Minimum Weight: </strong>${json.weight_min} lbs.<br>
                                    <strong>Maximum Weight: </strong>${json.weight_max} lbs.<br>
                                    <strong>Lifespan: </strong>${json.lifespan} years<br>
                                    <strong>Habitat: </strong>${json.habitat} <br>
                                    <strong>Diet: </strong>${json.diet} <br>
                                    <strong>Geo range: </strong>${json.geo_range} <br>
                                    </div>    
                                    `;

            document.getElementById("exhibitInfo").innerHTML = htmlToInsert; 
        });