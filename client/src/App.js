import React from 'react'
import { MemoryRouter} from 'react-router-dom'
import './css/bulma/bulma.min.css'
import {Columns, Container} from 'react-bulma-components'
import './css/app.css'
import Router from './Router';

function App() {
  return (
    <div className="App">
      <MemoryRouter>
        <Container>
          <Columns>
            <Columns.Column size={12}>

              <Router/>
            </Columns.Column>
          </Columns>
        </Container>
      </MemoryRouter>
    </div>
  );
}

export default App;
