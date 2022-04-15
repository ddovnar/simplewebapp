import {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import {Heading, Container, Form, Button, Card, Notification} from 'react-bulma-components'

// const URL_API = 'http://localhost:5020/api'
const URL_API = '/api'

export default function CalculationPage() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [banks, setBanks] = useState([])
    const [notify, setNotify] = useState(null)
    const [initialLoan, setInitialLoan] = useState(0)
    const [downPayment, setDownPayment] = useState(0)
    const [selectedBankId, setSelectedBankId] = useState(-1)
    const [monthlyPayment, setMonthlyPayment] = useState('')

    const firstEditRef = useRef()

    const loadData = async () => {
        try {
            const response = await fetch(`${URL_API}/bank`)
            const json = await response.json()
            setBanks(json)
        } catch (e) {
            console.error('Error:', e)
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

    const cancel = () => {
        navigate('/')
    }

    const calc = () => {
        setNotify(null)
        console.log('selectedBankId', selectedBankId, banks)
        let bank = banks.filter(item => item.id === selectedBankId)
        console.log(bank)
        if (bank.length > 0) {
            bank = bank[0]
            if (downPayment < bank.min_down_payment) {
                setNotify({type: 'error', text: `Min down payment must be greater then: ${bank.min_down_payment}`})
                return
            }
            if (initialLoan > bank.max_loan) {
                setNotify({type: 'error', text: `Maximum loan is: ${bank.max_loan}`})
                return
            }

            const r = bank.interest_rate / 100
            const n = bank.loan_term
            const P = initialLoan - downPayment
            const a = P * (r / 12)
            const b = Math.pow((1 + r / 12), n)
            const M = a * b / (b - 1)
            setMonthlyPayment(M.toFixed(2))
        }
    }

    const onChangeInitialLoan = (val) => {
        setInitialLoan(val)
    }

    const onChangeDownPayment = (val) => {
        setDownPayment(val)
    }

    const onSelectBank = (id) => {
        setSelectedBankId(parseInt(id))
    }

    return (
        <>
            <Container pt="6" pb="5" pl="4">
                <Heading>Calculation</Heading>
            </Container>
            <Card style={{width: 400}}>
                <Card.Content>
                    <Form.Field horizontal={true}>
                        <Form.Label pt={1} mr={2} style={{minWidth: 150}}>Initial Loan:</Form.Label>
                        <Form.Control>
                            <Form.Input placeholder='Enter text' required={true} domRef={firstEditRef}
                                type="number"
                                value={initialLoan} onChange={(e) => {onChangeInitialLoan(e.target.value)}}/>
                        </Form.Control>
                    </Form.Field>
                    <Form.Field horizontal={true}>
                        <Form.Label pt={1} mr={2} style={{minWidth: 150}}>Down Payment:</Form.Label>
                        <Form.Control>
                            <Form.Input placeholder='Enter text' required={true}
                                type="number"
                                value={downPayment} onChange={(e) => {onChangeDownPayment(e.target.value)}}/>
                        </Form.Control>
                    </Form.Field>
                    <Form.Field horizontal={true}>
                        <Form.Label pt={1} mr={2} style={{minWidth: 150}}>Bank:</Form.Label>
                        <Form.Control  style={{width: '100%'}}>
                            <Form.Select style={{width: '100%'}} 
                                value={selectedBankId} onChange={(e) => onSelectBank(e.target.value)}>
                                <option value="-1"></option>
                                { banks.map((item, idx) => 
                                    <option key={idx} value={item.id}>{item.name}</option>
                                    )
                                }
                            </Form.Select>
                        </Form.Control>
                    </Form.Field>
                    <Form.Field horizontal={true}>
                        <Form.Label pt={1} mr={2} style={{minWidth: 150}}>Monthly mortgage payment:</Form.Label>
                        <Form.Control>
                            <Form.Input placeholder='0.0' readOnly={true} value={monthlyPayment}/>
                        </Form.Control>
                    </Form.Field>
                    { notify &&
                        <Notification color={(notify.type === 'error') ? "danger" : (notify.type === 'success') ? "success" : ""}>
                            {notify.text}
                        </Notification>
                    }
                </Card.Content>
                <Card.Footer pt={4} pb={4} alignItems="center">
                    <Button.Group style={{margin: '0 auto'}}>
                        <Button size="small" onClick={(e) => cancel()}><span>Close</span></Button>
                        <Button size="small" color="primary" onClick={(e) => calc()}>Calculate</Button>
                    </Button.Group>
                </Card.Footer>
            </Card>
        </>
    )
}