import {useState, useEffect, useRef} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {Heading, Container, Form, Button, Card, Notification} from 'react-bulma-components'

// const URL_API = 'http://localhost:5020/api'
const URL_API = '/api'

export default function BankEditPage() {
    const params = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({})
    const [notify, setNotify] = useState(null)
    const [isChanged, setIsChanged] = useState(false)

    const firstEditRef = useRef()

    const loadData = async () => {
        if (params.id > 0) {
            try {
                const response = await fetch(`${URL_API}/bank/${params.id}`)
                const json = await response.json()
                setData(json)
            } catch (e) {
                console.error('Error:', e)
            } 
        } else {
            setData({
                "id": -1,
                "interest_rate": 0, 
                "loan_term": 0, 
                "max_loan": 0, 
                "min_down_payment": 0, 
                "name": ""
            })
        }
    }

    useEffect(() => {
        if (loading) {
            console.log('edit effect')
            loadData()
            setTimeout(() => {
                if (firstEditRef.current) {
                    firstEditRef.current.focus()
                }
            }, 200)
        }
        setLoading(true)
    }, [loading])

    const setDataValue = (key, value) => {
        setIsChanged(true)
        if (key === 'name') {
            setNotify(null)
        }

        if (key === 'interest_rate' || key === 'loan_term' || key === 'max_loan' || key === 'min_down_payment') {
            if (value === '') {
                value = 0
            }
        }

        data[key] = value
        setData({...data})
    }

    const save = async () => {
        if (data.name === '') {
            setNotify({type: 'error', text: 'Name is required'})
            return
        }
        try {
            const response = await fetch(`${URL_API}/bank`, {
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify(data)
            })
            const json = await response.json()
            if (json.status === -1) {
                throw "Operation failed"
            }
            setNotify({type: 'success', text: 'Saved'})
            setIsChanged(false)
        } catch (e) {
            setNotify({type: 'error', text: 'Error on save: ' + e.toString()})
        }
    }

    const cancel = () => {
        navigate('/')
    }

    return (
        <>
            <Container pt="6" pb="5" pl="4">
                <Heading>Bank edit</Heading>
            </Container>
            <Card style={{width: 400}}>
                <Card.Content>
                    {
                        data['id'] && <>
                            <Form.Field horizontal={true}>
                                <Form.Label pt={1} mr={2} style={{minWidth: 150}}>Name:</Form.Label>
                                <Form.Control>
                                    <Form.Input placeholder='Enter text' required={true} domRef={firstEditRef}
                                        value={data['name']} onChange={(e) => {setDataValue('name', e.target.value)}}/>
                                </Form.Control>
                            </Form.Field>
                            <Form.Field horizontal={true}>
                                <Form.Label pt={1} mr={2} style={{minWidth: 150}}>Interest Rate:</Form.Label>
                                <Form.Control>
                                    <Form.Input placeholder='Enter text' type='number'
                                        value={data['interest_rate']} onChange={(e) => {setDataValue('interest_rate', e.target.value)}}/>
                                </Form.Control>
                            </Form.Field>
                            <Form.Field horizontal={true}>
                                <Form.Label pt={1} mr={2} style={{minWidth: 150}}>Loan Term:</Form.Label>
                                <Form.Control>
                                    <Form.Input placeholder='Enter text' type='number'
                                        value={data['loan_term']} onChange={(e) => {setDataValue('loan_term', e.target.value)}}/>
                                </Form.Control>
                            </Form.Field>
                            <Form.Field horizontal={true}>
                                <Form.Label pt={1} mr={2} style={{minWidth: 150}}>Max Loan:</Form.Label>
                                <Form.Control>
                                    <Form.Input placeholder='Enter text' type='number'
                                        value={data['max_loan']} onChange={(e) => {setDataValue('max_loan', e.target.value)}}/>
                                </Form.Control>
                            </Form.Field>
                            <Form.Field horizontal={true}>
                                <Form.Label pt={1} mr={2} style={{minWidth: 150}}>Min Down Payment:</Form.Label>
                                <Form.Control>
                                    <Form.Input placeholder='Enter text' type='number'
                                        value={data['min_down_payment']} onChange={(e) => {setDataValue('min_down_payment', e.target.value)}}/>
                                </Form.Control>
                            </Form.Field>
                            { notify &&
                                <Notification color={(notify.type === 'error') ? "danger" : (notify.type === 'success') ? "success" : ""}>
                                    {notify.text}
                                </Notification>
                            }
                            
                        </>
                    }
                </Card.Content>
                <Card.Footer pt={4} pb={4} alignItems="center">
                    <Button.Group style={{margin: '0 auto'}}>
                        <Button size="small" onClick={(e) => cancel()}>{(isChanged) ? <span>Cancel</span> : <span>Close</span>}</Button>
                        <Button size="small" color="primary" disabled={!isChanged} onClick={(e) => save()}>Save</Button>
                    </Button.Group>
                </Card.Footer>
            </Card>
        </>
    )
}