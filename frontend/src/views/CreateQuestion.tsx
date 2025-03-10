/*
MIT License

Copyright (c) 2023 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF,
OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { useContext, useState } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { createMcqQuestion } from '../util/createMcqQuestion'
import '../assets/styles/createRoom.css'
import { AppContext } from '../components/App'
import '../assets/styles/loader.css'

export default function CreateQuestion({ history }: RouteComponentProps) {
  const [title, setTitle] = useState('')
  const [correctAnswer, setCorrect] = useState(0)
  const [options, setOptions] = useState(['', '', '', ''])
  const { roomId, isLoading, setIsLoading } = useContext(AppContext)
  var template = localStorage.getItem('template') || 'default';
  function setCorrectAnswer(index: number){
    setCorrect(index)
  }

  function setOptionIndex(optionValue: string, index: number) {
    let _options = options
    _options[index] = optionValue
    setOptions(_options)
  }

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container px-5">
                    <a className="navbar-brand" href="/">PollMe</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item"><a className="nav-link" aria-current="page" href="#!">Home</a></li>
                            <li className="nav-item"><a className="nav-link" href="/contactus">Contact</a></li>
                            <li className="nav-item"><a className="nav-link" href="/login-user">Login</a> </li>

                        </ul>
                    </div>
                </div>
    </nav>


    <section className="py-5 border-bottom" id="features">
            <div className="container px-5 my-5">
                <div className="row gx-5">
               
                    <div className="col-lg-6">
                 <div className="card2 card border-0 px-4 py-5">
                    <div className="row mb-4 px-3">
                        <h3 className="mb-0 mr-4 mt-2">Create Your Question</h3>
                        <p className="mb-0 text-sm">
                          So, it's question-making time! Just type you question prompt in the box and list the possible options!
                        </p>
                    </div>
                    <div className="row px-3 mb-4">
                        <div className="line"></div>
                    </div>
                    <div className="row px-3">
                       <label className="mb-1"><h4 className="mb-0 text-sm">Question Title</h4></label>
                       <p>
                         Let's first come up with a clear and consise question prompt for our pollers!
                       </p>
                        <input
                              type='text'
                              className='mb-4'
                              placeholder='Type your question..'
                              onChange={(event) => {
                                setTitle(event.target.value)
                              }}
                        />
                    </div>
                
                    <div className="row px-3"> 
                    <label className="mb-1"><h4 className="mb-0 text-sm">Possible Options</h4>
                     </label> 
                     <p>
                       Now, we will decide the options to be given to our pollers.
                     </p>
            <input
              type='text'
              className='mb-4'
                            placeholder='a) Define an answer..'
              onChange={(e) => setOptionIndex(e.target.value, 0)}
            />
            <input
              type='text'
              className='mb-4'
                            placeholder='b) Define an answer..'
              onChange={(e) => setOptionIndex(e.target.value, 1)}
            />
            <input
              type='text'
              className='mb-4'
              placeholder='c) Define an answer..'
              onChange={(e) => setOptionIndex(e.target.value, 2)}
            />
            <input
              type='text'
              className='mb-4'
              placeholder='d) Define an answer..'
              onChange={(e) => setOptionIndex(e.target.value, 3)}
            /> 

            <label className="mb-1"><h4 className="mb-0 text-sm">Choose the correct answer</h4>
            <p>
              Please tick the correct option from the ones you just entered. <br/>
              This will be used to provide feedback to your pollers!
            </p>
            </label>

            <span> 
              a)&nbsp;
              <input
              type ='radio'
              checked
              name='same'
              onClick={()=>setCorrectAnswer(0)}
              />&nbsp;
              
              b)&nbsp;
              <input
              type ='radio'
              name='same'
              onClick={()=>setCorrectAnswer(1)}
              />&nbsp;
              
              c)&nbsp;
              <input
              type ='radio'
              name='same'
              onClick={()=>setCorrectAnswer(2)}
              />&nbsp;
              
              d)&nbsp;
              <input
              type ='radio'
              name='same'
              onClick={()=>setCorrectAnswer(3)}
              />
            </span>
            <br/> <br/>
                    </div>

                 {/*
                  <div className="row mb-3 px-3"> <button type="submit" className="btn btn-blue text-center">Login</button> </div>
                 */}  

                    <div className='row mb-3 px-3'>

                    {isLoading ? (
              <div className='loader'>Loading...</div>
            ) : (
              <div
              className="get-started btn btn-primary btn-lg px-4 me-sm-3 hover:shadow-lg ease-linear transition-all duration-150"              onClick={async () => {
                  setIsLoading(true);
                  try {
                    const res = await createMcqQuestion({
                      title,
                      options,
                      roomId,
                      correctAnswer,
                    })
                    console.log(res)
                    setIsLoading(false);
                    history.push('/admin-dashboard') 
                  } catch (error) {
                    console.log(error);
                    
                  }

                  setIsLoading(false);

                }}
              >
                Publish
              </div>
            )}
                    </div>
                
                </div>
            </div>


            <div className="col-lg-6">
                    <div className="card2 card border-0 px-4 py-5">
                        <div className="row">
                        <img
    
    src={require(`assets/img/${template+template}.jpg`).default}
    alt='...'
  />  </div>
                        <div className="row px-3 justify-content-center mt-4 mb-5 border-line"> </div>
                    </div>
                </div>

                
                </div>
            </div>
    </section>



    </>
  )
}