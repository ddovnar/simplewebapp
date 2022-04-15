import {useState, useEffect} from 'react'
import {Heading, Box, Table, Container, Button} from 'react-bulma-components'
import { Link, useNavigate } from "react-router-dom"

//const URL_API = 'http://localhost:5020/api'
const URL_API = '/api'

export default function BankListPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const loadData = async () => {
        try {
            const response = await fetch(`${URL_API}/bank`)
            const json = await response.json()
            setData(json)
        } catch (e) {
            console.error('Error:', e)
        } 
    }
    useEffect(() => {
        if (loading) {
            console.log('effect')
            loadData()
        }
        setLoading(true)
    }, [loading])

    const add = () => {
        navigate('/bank/-1')
    }

    const calc = () => {
        navigate(`/calc`)
    }

    const del = async (id) => {
        try {
            const response = await fetch(`${URL_API}/bank/${id}`, {
                method: 'DELETE'
            })
            const json = await response.json()
            if (json.status === -1) {
                throw "Operation failed"
            }
            setData(data.filter(item => item.id !== id))
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <>
            <Container pt="6" pb="5" pl="4">
                <Heading>Banks</Heading>
            </Container>
            <Box>
                <Button.Group>
                    <Button size="small" color="primary" onClick={(e) => add()}>Add</Button>
                    <Button size="small" color="info" onClick={(e) => calc()}>Calculate</Button>
                </Button.Group>
                <Table size="fullwidth">
                    <thead>
                        <tr>
                            <th style={{width: 400}}>Name</th>
                            <th>Interest Rate</th>
                            <th>Loan Term</th>
                            <th>Max Loan</th>
                            <th>Min Down Payment</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((row, idx) =>
                                <tr key={row.id}>
                                    <td><Link to={'/bank/' + row.id}>{row.name}</Link></td>
                                    <td>{row.interest_rate}</td>
                                    <td>{row.loan_term}</td>
                                    <td>{row.max_loan}</td>
                                    <td>{row.min_down_payment}</td>
                                    <td>
                                        <Button size="small" color="danger" onClick={(e) => del(row.id)}>Delete</Button>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </Box>
        </>
    )
}