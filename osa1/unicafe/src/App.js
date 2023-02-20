import { useState } from 'react'



const Header = () => ( 
  <h1>give feedback</h1>
)

const Button = (props) => (

      <button onClick={props.handleClick}>
        {props.text}
      </button>

  )




  const Statistics = ({good, neutral, bad,}) => {


    
  
    if (good === neutral && good === bad && good === 0) {
      
      return <p>No feedback given</p>

    }

    else {

      return (
 
        <div>
          
          <table>
            <tbody>
              <StatisticLine text="good" value ={good} />
              <StatisticLine text="neutral" value ={neutral} />
              <StatisticLine text="bad" value ={bad} />
              <StatisticLine text="average" value ={(good+neutral*0+bad*(-1))/(good+neutral+bad)} />
              <StatisticLine text="positive" value ={(good/(good+neutral+bad))*100 + ' %'}/>
            </tbody>
          </table>
        </div>
      )
    }
  
  }

  const StatisticLine = (props) => {
  
    return (
      <tr>
        <td>{props.text}</td> 
        <td>{props.value}</td>
      </tr>
    )

  }

  const StatisticsHeading = () => (  
    <h2>statistics</h2>
  )



const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <Header/>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <StatisticsHeading/>
      <Statistics good = {good} neutral = {neutral} bad = {bad}/>
    </div>
  )
}

export default App