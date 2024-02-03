import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from "react";
// import RadioApp from './Table';
// import Table from './Table';

function App() {
  const [data, setData] = useState([]);

  const [id, setID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [course, setCourse] = useState('reactjs');

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
  })

  // Fetching data from an url link - cRud
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://620fad6fec8b2ee2834903e1.mockapi.io/users');
        setData(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the respective state
    if (name === 'gender') {
      setGender(value);
    } else {
      // Update form data state
      switch (name) {
        case 'firstName':
          setFirstName(value);
          break;
        case 'lastName':
          setLastName(value);
          break;
        case 'email':
          setEmail(value);
          break;
        case 'course':
          setCourse(value);
          break;
        default:
          break;
      }

      if (value.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `${name} is required`,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }
  }

  // Creating/Updating documents
  const formSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !gender) {
      alert('Please fill in all required fields');
      return;
    }

    // crUd - Update
    if (id) {
      try {
        const response = await axios.put(`https://620fad6fec8b2ee2834903e1.mockapi.io/users/${id}`, {
          firstName: firstName,
          lastName: lastName,
          email: email,
          gender: gender,
          course: course
        });

        let index = data.findIndex((row) => row.id === response.data.id);
        let dataToUpdated = [...data];
        dataToUpdated[index] = response.data;
        setData(dataToUpdated);

        setFirstName('');
        setLastName('');
        setEmail('');
        setGender('');
        setCourse('reactjs');
      } catch (err) {
        // console.error("Error submitting form:", err);
        alert(err)
      }
    } else {
      // Crud - Create
      try {
        const response = await axios.post('https://620fad6fec8b2ee2834903e1.mockapi.io/users/', {
          firstName: firstName,
          lastName: lastName,
          email: email,
          gender: gender,
          course: course
        });

        console.log("response data:", response.data);
        // let index = data.findIndex((row) => row.id === response.data.id);
        // let dataToUpdated = [...data];
        // dataToUpdated[index] = response.data;
        let dataToUpdated = [...data];
        dataToUpdated.push(response.data)
        setData(dataToUpdated);

        setFirstName('');
        setLastName('');
        setEmail('');
        setGender('');
        setCourse('reactjs');

        alert("Form submitted successfully")
      } catch (err) {
        // console.error("Error submitting form:", err);
        alert(err);
      }
    }
  }

  // table head
  const resultArray = [...new Set(data.map(item => Object.keys(item)).flat()), 'actions'];
  const table_head = resultArray.map((data) => (
    React.createElement("td", { key: data }, data)
  ));

  // table body
  const table_body = data.map((data) => (
    React.createElement("tr", { key: data.id },
      React.createElement("td", null, data.firstName),
      React.createElement("td", null, data.lastName),
      React.createElement("td", null, data.email),
      React.createElement("td", null, data.gender),
      React.createElement("td", null, data.course),
      React.createElement("td", null, data.id),
      React.createElement("td", null,
        React.createElement("button", { onClick: () => handleEdit(data.id) }, "Edit"),
        React.createElement("button", { onClick: () => onConfirmDelete(data.id) }, "Delete"))
    )));

  const handleEdit = (id) => {
    const selectedData = data.filter((row) => row.id === id)[0];
    setID(selectedData.id);
    setFirstName(selectedData.firstName);
    setLastName(selectedData.lastName);
    setEmail(selectedData.email);
    setGender(selectedData.gender);
    setCourse(selectedData.course);
  };

  const onConfirmDelete = async (id) => {
    // console.log("id:", id);
    const confirmed = window.confirm("Are you sure want to delete this entry?");
    if (confirmed) {
      await handleDelete(id)
      setFirstName('');
      setLastName('');
      setEmail('');
      setGender('');
      setCourse('reactjs');
    }
  }

  const handleDelete = async (id) => {
    const user_delete = await axios.delete(`https://620fad6fec8b2ee2834903e1.mockapi.io/users/${id}`);
    console.log("deleted_response:", user_delete);

    if (!user_delete) {
      return alert(user_delete.status)
    }

    if (user_delete.statusText === "OK") {
      let dataToUpdated = data.filter((row) => row.id !== id);
      setData(dataToUpdated);
    }
  };

  return (
    <>
      <header>
        <div className='container row'>
          <a className="app_title" href="/">Controlled-Forms-Functional components </a>
        </div>
      </header>

      <main className='container row'>
        <section className='table_section'>
          <table>
            <thead>
              <tr>
                {table_head}
              </tr>
            </thead>
            <tbody>
              {table_body}
            </tbody>
          </table>
        </section>

        <section className='form_section'>
          <form className='form__content' onSubmit={(e) => formSubmit(e)}>
            <div className="row">
              <label>First name:</label>
              <input type="text" name="firstName" value={firstName} onChange={handleChange} />
            </div>
            <div style={{ color: 'red' }}>{errors.firstName}</div>

            <div className="row">
              <label>Last name:</label>
              <input type="text" name="lastName"
                value={lastName}
                onChange={handleChange} />
            </div>
            <div style={{ color: 'red' }}>{errors.lastName}</div>

            <div className="row">
              <label>Email:</label>
              <input type="email" name="email"
                value={email}
                onChange={handleChange} />
            </div>
            <div style={{ color: 'red' }}>{errors.email}</div>

            <div className="row">
              <span>Gender:</span>
              <span className="form__input--name">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={handleChange}>
                </input>
                <label>Male</label> &nbsp;

                <input type="radio" name="gender" value="female" checked={gender === "female"} onChange={handleChange} />
                <label>Female</label>
              </span>
            </div>
            {/* <div style={{ color: 'red' }}>{errors.gender}</div> */}

            <div className="row">
              <label>Courses:</label>
              <select name="course" className="btn--class"
                value={course}
                onChange={(e) => setCourse(e.target.value)}>
                <option value="reactjs">ReactJs</option>
                <option value="nodejs">NodeJs</option>
                <option value="mongodb">MongoDB</option>
              </select>
            </div>
            {/* <div style={{ color: 'red' }}>{errors.course}</div> */}

            <div className="row">
              <div className="form__input--buttons">
                {/* <button className="btn--class">Reset</button> */}
                <button className="btn--class">Sumbit</button>
              </div>
            </div>
          </form>
        </section>

      </main>
    </>
  );
}

export default App;
