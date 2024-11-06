import { Avatar, Box, Button, Container, Grid, InputBase, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import dumb from "../../../../assets/images/dumb.png"


export function ChatAdmin() {

    const [messages, setMessages] = useState([
        { id: 1, sender: 'admin', text: 'Yes, is there anything I can help?' },
        { id: 2, sender: 'user', text: 'Hello Admin, I Need Your Help' },
    ]);

    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, sender: 'user', text: newMessage }]);
            setNewMessage('');
        }
    };


    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', color: '#fff' }}>
            <Box sx={{ width: '25%', padding: '20px', borderRight: "1px solid #444444" }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <img src={dumb} alt="Logo" style={{ width: '60px', marginLeft: "17px" }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '30px', padding: '10px' }}>
                    <Avatar alt="User" src="/user-avatar.png" sx={{ width: 40, height: 40 }} />
                    <Box sx={{ marginLeft: '10px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>INi teh user</Typography>
                        <Typography variant="body2" sx={{ color: '#b0bec5' }}>Yes, is there anything I can help?</Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ width: '80%', padding: '20px' }}>
                <Box sx={{ ml: "auto", display: "flex", justifyContent: "end" }}>
                    <Link to='/complain' style={{ textDecoration: "none", color: "inherit" }}>
                        <Button size="large" color="inherit">Complain</Button>
                    </Link>
                    <Link to='/category' style={{ textDecoration: "none", color: "inherit" }}>
                        <Button size="large" color="inherit">Category</Button>
                    </Link>
                    <Link to='/product' style={{ textDecoration: "none", color: "inherit" }}>
                        <Button size="large" color="inherit">Product</Button>
                    </Link>
                    <Link to='/logout' style={{ textDecoration: "none", color: "inherit" }}>
                        <Button size="large" color="inherit">Logout</Button>
                    </Link>
                </Box>

                <Box sx={{ padding: '20px', borderRadius: '10px', minHeight: '400px', paddingTop: "40px ", overflowY: 'auto', display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    {messages.map((message) => (
                        <Box
                            key={message.id}
                            sx={{
                                display: 'flex',
                                justifyContent: message.sender === 'admin' ? 'flex-start' : 'flex-end',
                                marginBottom: '10px',
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: message.sender === 'admin' ? '#575757' : '#262626',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    maxWidth: '60%',
                                }}
                            >
                                <Typography>{message.text}</Typography>
                            </Box>
                        </Box>
                    ))}
                    <div ref={chatEndRef} />

                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '20px',
                        backgroundColor: '#333',
                        borderRadius: '10px',
                        padding: '10px',
                    }}
                >
                    <InputBase
                        placeholder="Send Message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleEnter}
                        sx={{ flexGrow: 1, color: '#fff', paddingLeft: '10px' }}
                    />

                </Box>
            </Box>
        </Box>
    );
}
