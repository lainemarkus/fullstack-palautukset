
const Course = (props) => {
  
    const { course } = props
    //console.log(course.parts)
    console.log(course.parts)
  




    const Header = ({ course }) => <h1>{course}</h1> 


    const Content = ({ parts }) => { 

        const result = parts.map(part => (
        <p key={part.id}>{part.name} {part.exercises}</p>
        ))
        //console.log(result)
  
        return result
    
    }
  
  
    const Total = ({ parts }) => {
  
    const totalSum = parts.reduce((total, part) =>  total + part.exercises, 0) // Calculate the sum of all parts' exercises 
   
    return ( 
      <strong>Number of exercises {totalSum}</strong>
    )
  
    }
  



    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts}/>
            <Total parts={course.parts}/>

        </div>

    )
}

export default Course 