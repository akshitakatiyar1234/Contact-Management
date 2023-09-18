import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import {CSVLink} from "react-csv";
import ToastContext from "../context/ToastContext";


const columnname=[
  { label: 'NAME' ,key :'name'},
  { label: 'ADDRESS' ,key :'address'},
  { label: 'EMAIL' ,key :'email'},
  { label: 'PHONE' ,key :'phone'},
]

const AllContact = () => {
  const { toast } = useContext(ToastContext);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({});
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
 

  useEffect(async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/mycontacts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await res.json();
      if (!result.error) {
        setContacts(result.contacts);
        setLoading(false);
      } else {
        console.log(result);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const deleteContact = async (id) => {
    if (window.confirm("are you sure you want to delete this contact ?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!result.error) {
          setContacts(result.myContacts);
          toast.success("Contact Deleted Successfully");
          setShowModal(false);
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  


  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const searchResultUsers = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase())
    );
    console.log(searchResultUsers);
    setContacts(searchResultUsers);
  };
  
  const ascendingEvent=()=>{
    let ascdata=[...contacts]
    if(ascdata.length>0){
      let sorteddata=ascdata.sort((a,b)=>a.name.localeCompare(b.name))
      setContacts(sorteddata)
    }
    
  }

  const descendingEvent=()=>{
    let descdata=[...contacts]
    if(descdata.length>0){
      let sorteddata=descdata.sort((a,b)=>b.name.localeCompare(a.name))
      setContacts(sorteddata)
    }
  }

  return (
    <>
      <div>
        <h1>Your Contacts</h1>
        <a href="/mycontacts" className="btn  btn-dark active my-2">
          Reload Contact
        </a>
        <CSVLink data={contacts} headers={columnname}>
        <Button  className="btn btn-dark my-2" >Download Contacts</Button>
        </CSVLink>
        
        <Button  onClick={ascendingEvent} className="btn btn-dark my-2" type="button" >Ascending Sort</Button>
        <Button  onClick={descendingEvent} className="btn btn-dark my-2" type="button" > Descending Sort </Button>
        <hr className="my-4" />
        {loading ? (
          <Spinner splash="Loading Contacts..." />
        ) : (
          <>
            {contacts.length == 0 ? (
              <h3>No contacts</h3>
            ) : (
              <>
                <form className="d-flex" onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="form-control my-2"
                    placeholder="Search Contact"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" className="btn btn-info mx-2">
                    Search
                  </button>
                </form>

                <p>
                Total Contacts: <strong>{contacts.length}</strong>
                </p>
                <div className="table-responsive-sm">
                <table className="table table-hover ">
                  <thead>
                    <tr className="table-dark">
                      <th scope="col">Name</th>
                      <th scope="col">Address</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr
                        key={contact._id}
                        onClick={() => {
                          setModalData({});
                          setModalData(contact);
                          setShowModal(true);
                        }}
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
              </>
            )}
          </>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h3>{modalData.name}</h3>
          <p>
            <strong>Address</strong>: {modalData.address}
          </p>
          <p>
            <strong>Email</strong>: {modalData.email}
          </p>
          <p>
            <strong>Phone Number</strong>: {modalData.phone}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Link className="btn btn-outline-primary" to={`/edit/${modalData._id}`}>
            Edit
          </Link>
          <button
            className="btn btn-outline-danger"
            onClick={() => deleteContact(modalData._id)}
          >
            Delete
          </button>
          
          
          <button
            className="btn btn-outline-success"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AllContact;