import React, { useEffect } from 'react'
import { Container, Box, Text, Tabs, TabList, TabPanel, TabPanels, Tab } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useHistory } from 'react-router-dom'

const Homepage = () => {

    const history = useHistory()
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"))
        if (user)
            history.push("/chats")
    }, [history])

    return <Container maxW='xl' centerContent>
        <Box
            d='flext'
            justifyContent='center'
            p={3}
            bg="rgba(255, 255, 255, 0.6)"
            backdropFilter="blur(10px)"
            boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
            border="3px solid rgba(255, 255, 255, 0.3)"
            w="100%"
            m="40px 0 15px 0"
            borderRadius="10px"
            padding="20px"
            borderWidth="1px">
            <Text fontSize="4xl" textAlign="center">Chandu's Chat App</Text>
        </Box>
        <Box
            bg="rgba(255, 255, 255, 0.5)"
            w="100%"
            p={4}
            borderRadius="10px"
            borderWidth="1px"
            border="3px solid rgba(255, 255, 255, 0.3)"
            boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"

        >
            <Tabs variant='soft-rounded'>
                <TabList mb="1em">
                    <Tab width="50%" >Login</Tab>
                    <Tab width="50%">SignUp</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel >
                        <Login />
                    </TabPanel>
                    <TabPanel>
                        <Signup />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container>
}

export default Homepage
