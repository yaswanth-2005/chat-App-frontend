import React, { useState } from 'react'
import { Button } from '@chakra-ui/button'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { VStack } from '@chakra-ui/layout'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const Signup = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmpassword] = useState('')
    const [pic, setPic] = useState('')
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()


    const handleClick = () => setShow(!show)

    const postDetails = (pics) => {
        setLoading(true)
        if (pics === undefined) {
            toast({
                title: "please select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData()
            data.append("file", pics)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "dwwv5vw5b")
            fetch("https://api.cloudinary.com/v1_1/dwwv5vw5b/image/upload", {
                method: "post",
                body: data,
            }).then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json()
            })
                .then(data => {
                    console.log("Response Data:", data)
                    setPic(data.url.toString())
                    console.log(pic)
                    setLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                    setLoading(false)
                })
        } else {
            toast({
                title: "Please select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            setLoading(false)
            return
        }
    }

    const submitHandler = async () => {
        setLoading(true)
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please fill out all the fields..",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            setLoading(false)
            return;
        }

        if (password !== confirmpassword) {
            toast({
                title: "Password and ConfirmPassword must be same..",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            }
            const { data } = await axios.post("/api/user", {
                name, email, password, pic
            }, config)
            console.log(data)
            toast({
                title: "Registration Successfull..",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            localStorage.setItem("userInfo", JSON.stringify(data))
            setLoading(false)
            history.push("/chats")
        } catch (error) {

        }
    }

    return (
        <VStack
            spacing="10px"
            bg="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
            boxShadow=" 0px 8px 16px 0px rgba(0, 0, 0, 0.15)"
            border="2px solid rgba(255, 255, 255, 0.3)"
            padding="20px"
            borderRadius="15px"
        >
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    type="email"
                    placeholder="Enter Your Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup
