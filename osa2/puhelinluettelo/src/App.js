import { useState, useEffect } from 'react'
import personService from './services/persons'
import './App.css'


const PersonForm = ({ addPerson, ...props }) => {
  
  const { newName, newNumber, handleNameChange, handleNumberChange } = props

  return (
    <form onSubmit={addPerson}>
      <div>name: <input value={newName} onChange={handleNameChange}/></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
      <div>
        <button type="submit">add</button>
  
      </div>
    </form>
  )

}

const Person = ({ id, name, number, handleDelete }) => {

  return (
    <p key={name}> 
      {name} {number} <button onClick= { () => handleDelete(id)}>delete</button >
    </p>
    
  )
}

const Persons = ({ personsToShow, handleDelete }) => {

  return (
    <>
      {personsToShow.map(person => (
        <Person 
          id = {person.id}
          key={person.name} 
          name={person.name} 
          number={person.number}
          handleDelete={handleDelete}
        /> 
      ))}
    </>
  )
}


const Filter = ({ filterText, handleFilterChange }) => {

  return (
    <>
      <p>filter shown with <input value={filterText} onChange={handleFilterChange}></input></p>
    </>
  )
}


const Notification = ({ type, message, handleNotificationChange}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>

  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('error') 


  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  console.log('render', persons.length, 'persons')



  const updateNumber = (newName, newNumber) => {
    const personToUpdate = persons.find(person => person.name === newName)
    const updatedPerson = { ...personToUpdate, number: newNumber }

    personService
      .update(personToUpdate.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== personToUpdate.id ? person : returnedPerson))
        setNewName('')
        setNewNumber('')
        setNotificationType('success')
        setNotificationMessage(`Updated new number ${newNumber} for ${personToUpdate.name}`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 3000)
      })
  }
 




  const addPerson = (event) => {

    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber  
    }

    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        updateNumber(newName, newNumber)
      }
    }
    else {
      personService
        .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotificationType('success')
            setNotificationMessage(`Added ${returnedPerson.name}`)
            
            setTimeout(() => {
              setNotificationMessage(null)
            }, 3000)
            console.log(notificationMessage)
          })    
    }



  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterText(event.target.value)
    console.log(event.target.value)
  }

  const handleNotificationChange = (event) => {
    setNotificationMessage(event.target.value)
    console.log(event.target.value)
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id)
  
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })

        .catch(error => {
          setNotificationType("error")
          setNotificationMessage(
            `Information of '${personToDelete.name}' has already been removed from server`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
          setPersons(persons.filter(person => person.id !== id))
        })

        setNotificationType('success')
        setNotificationMessage(`Deleted ${personToDelete.name}`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 3000)

    }
  }



  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification type={notificationType} message={notificationMessage} handleNotificationChange={handleNotificationChange}/>
      <Filter filterText={filterText} handleFilterChange={handleFilterChange}/>
      
      <h2>add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange= {handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson}/>

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    
    </div>
  )


}


export default App