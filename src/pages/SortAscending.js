import  { useEffect, useState } from "react";


const SortAscending = () => {
const [data, setContacts] = useState([]);


useEffect(async () => {
    
    try {
        const res = await fetch(`http://localhost:8000/api/sortmycontacts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        const sorteddata=result.contacts.sort((a,b)=>a.name.localeCompare(b.name));
        if (!result.error) {

          setContacts(sorteddata);
         
        } else {
          console.log(result);
          
        }
      } catch (err) {
        console.log(err);
      }
    }, []);
    
     
    
  
    
   {/* data ?
// data.map((item) => {

//     return(
//             <li> {item.name}</li>
//          )
//    }) : "no data"
//    } */}
return(
    <div>
    <table className="table table-hover">
                  <thead>
                    <tr className="table-dark">
                      <th scope="col">Name</th>
                      <th scope="col">Address</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                    </tr>
                  </thead>
<tbody>

     {data.map((contact) => (
         <tr
            key={contact._id}
        >
        <th scope="row">{contact.name}</th>
        <td>{contact.address}</td>
        <td>{contact.email}</td>
        <td>{contact.phone}</td>
        </tr>
         ))}
</tbody>
</table>
</div>

)

     }

export default SortAscending;