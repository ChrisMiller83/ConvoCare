import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import "./Journal.css";
import {ReactComponent as Book} from '../images/book.svg'

//TODO only show form if edit button was clicked
//TODO update models and migrations from string to text for journals and threads

export default function Journal() {
  const [journalEntries, setJournalEntries] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [activeEntry, setActiveEntry] = useState({ description: '', content: '', id: null })
  const [showEntry, setShowEntry] = useState(false);
  const handleCloseEntry = () => setShowEntry(false);
  const handleShowEntry = (entry) => {
    setShowEntry(true)
    setActiveEntry(entry)
    setEditForm({description: entry.description, content: entry.content})
  }

  const [form, setForm] = useState({
    description: "",
    content: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // editing journal posts
  const [isEdit, setIsEdit] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const handleEditFormClose = () => setShowEditForm(false);
  const handleEditFormShow = () => {
    setShowEditForm(true);
    setShowEntry(false)
    setIsEdit(true)
  }
  
  const [editForm, setEditForm] = useState({
    description: '',
    content: '',
  });

  const handleEditChange = (e) => {
      setEditForm({
        ...editForm,
        [e.target.name]: e.target.value,
      });
  }
  

  // const [threads, setThreads ] = useState([])
  // const [rightSide, setRightSide ] = useState({})

  // console.log(threads)

  // const handleRight = (id) => {
  //     console.log('click')
  //     fetch(`/api/v1/threads/${id}`)
  //     .then(res => res.json())
  //     .then(data => {
  //         setRightSide(data)
  //     })
  // }

  // useEffect(() => {
  //     fetch('/api/v1/f')
  //         .then(res => res.json())
  //         .then(data => {
  //             setThreads(data)
  //         })
  // }, [])


  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/v1/journals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: form.description,
        content: form.content,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          fetch("/api/v1/journals/currentuser")
            .then((res) => res.json())
            .then((data) => {
              setJournalEntries(data);
            });
        }
      });
  };

  // const handleEditButton = () => {
  //   console.log('click')
  //   setShowEntry(false)
  //   setIsEdit(true)
  // }

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log(activeEntry.id)
    fetch(`/api/v1/journals/${activeEntry.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: editForm.description,
        content: editForm.content,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          fetch("/api/v1/journals/currentuser")
          .then((res) => res.json())
          .then((data) => {
            setJournalEntries(data);
            setShowEditForm(false)
          });
        }
      });
  };

  // fetch journal entries by current user, after logged in, on component render
  useEffect(() => {
    fetch("/api/v1/journals/currentuser")
      .then((res) => res.json())
      .then((data) => {
        setJournalEntries(data);
      });
  }, []);

  return (
    <div style={{margin: '25px'}}>
      <Container>
        <Row>
          <Col
            className="user-profile-column"
            md={12}
            style={{ border: "solid black 1px" }}
          >
            <h1>My Journal</h1>
            <h4>Write about whatever you'd like: your day, your thoughts,
            what you've been working on. 
            </h4>
            <h4>Over time, you will have a</h4>
            <div style={{ marginTop: "25px" }}>
              <div>
                <Button
                  onClick={handleShow}
                  style={{ float: "right", marginBottom: "15px" }}
                >
                  New entry
                </Button>
                {
                  // button opens modal for new entry
                }
              </div>
              <Modal
                size="lg"
                show={show}
                onHide={() => setShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>New Journal Entry</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                  <Modal.Body>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        placeholder="Please title your entry."
                        as="textarea"
                        rows={1}
                        name="description"
                        onChange={handleChange}
                        value={form.description}
                      />
                      <Form.Label>Entry</Form.Label>
                      <Form.Control
                        placeholder="Start writing about whatever
                                            youd like!"
                        as="textarea"
                        rows={3}
                        name="content"
                        onChange={handleChange}
                        value={form.content}
                      />
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={handleClose}
                    >
                      Save your entry
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal>
              <Card
                style={{
                  height: "65vh",
                  width: "100%",
                  marginTop: "25px",
                  marginBottom: "25px"
                }}
              >
                <Card.Body style={{ overflowY: "scroll" }}>
                {journalEntries.length <= 0 ? <Book style={{display: 'block', margin: 'auto', width: '100%', height: '100%'}}/> : <p></p>}
                  {journalEntries.map((entry) => (
                    <Card key={entry.id} style={{ backgroundColor: 'rgba(255,255,255,0.95)', width: "100%", marginBottom: "5px" }}>
                      <Card.Body>
                        <Card.Title onClick={() => handleShowEntry(entry)}>
                          {entry.description} <span style={{float: 'right'}}>{new Date(entry.updatedAt).toString().split(' ').splice(0,4).join(' ')}</span>
                        </Card.Title>
                       
                        <Card.Text>{entry.content}</Card.Text>
                      </Card.Body>
                    </Card>
                  ))}
                  <Modal
                    size="lg"
                    show={showEntry}
                    onHide={() => setShowEntry(false)}
                    aria-labelledby="example-modal-sizes-title-lg"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>{activeEntry.description}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{activeEntry.content}</Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseEntry}>
                        Exit
                          </Button>
                      <Button
                        variant="primary"
                        onClick={handleEditFormShow}
                      >
                        Edit your entry.
                          </Button>
                    </Modal.Footer>
                  </Modal>

                    {/*
                    ---
                    EDITING MODAL BELOW
                    ---
                    */}

                  {isEdit &&                
                      <Modal
                      size="lg"
                      show={showEditForm}
                      onHide={handleEditFormClose}
                      aria-labelledby="example-modal-sizes-title-lg"
                      >
                      <Modal.Header closeButton>
                        <Modal.Title>Edit Journal Entry</Modal.Title>
                      </Modal.Header>
                      <Form onSubmit={handleEditSubmit}>
                        <Modal.Body>
                          <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                              // placeholder="Please title your entry."
                              as="textarea"
                              rows={1}
                              name="description"
                              onChange={handleEditChange}
                              value={editForm.description}
                            />
                            <Form.Label>Entry</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="content"
                              onChange={handleEditChange}
                              value={editForm.content}
                            />
                          </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleEditFormClose}>
                            Cancel
                    </Button>
                          <Button
                            variant="primary"
                            type="submit"
                            onClick={handleClose}
                          >
                            Save your entry
                    </Button>
                        </Modal.Footer>
                      </Form>
                    </Modal>
                    }
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div >
  );
}
