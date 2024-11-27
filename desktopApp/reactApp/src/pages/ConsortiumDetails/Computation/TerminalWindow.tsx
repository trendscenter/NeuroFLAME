import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { electronApi } from "../../../apis/electronApi/electronApi";
import ScrollToBottom from 'react-scroll-to-bottom';
import { Box, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ScrollToBottomWrapper = forwardRef<HTMLDivElement, React.ComponentProps<typeof ScrollToBottom>>(
  (props, ref) => {
    return <ScrollToBottom {...props} />;
  }
);

const TerminalWindow: React.FC<{command:string}> = ({command}) => {
  // State to store terminal input and output
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isTerminalReady, setTerminalReady] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [imageExists, setImageExists] = useState(false);

  const { spawnTerminal, terminalInput, terminalOutput, removeTerminalOutputListener } = electronApi;
  
  // Refs to interact with the DOM elements
  const inputRef = useRef<HTMLInputElement | null>(null);
  const terminalRef = useRef<HTMLDivElement | null>(null); 
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Request Electron to spawn a new terminal (IPC call to spawn terminal)
    if(!isTerminalReady){
      spawnTerminal(setTerminalReady);
      checkIfImageDownloaded();
    }
    terminalOutput(output, setOutput);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    let imageId = false;
    let outputObj = Array.from(new Set(output))[0];
    if(outputObj && JSON.parse(outputObj)[0]){
      imageId = JSON.parse(outputObj)[0]['Id'];
    }
    if(outputObj && imageId){
      setImageExists(true);
    }else{
      setImageExists(false);
    }
    console.log(imageId, outputObj);
  }, [output])

  const checkIfImageDownloaded = () => {
    const imageName = command.replace('docker pull ','');
    terminalInput('docker image inspect '+imageName);
  };

  const handleButtonPress = (input:string) => {
      terminalInput(input);
      terminalOutput(output, setOutput);
      setShowTerminal(true);
      setInput('');
  }; 

  return (
    <>
      {!imageExists &&
      <Button 
        variant='contained' 
        size='small'
        onClick={() => handleButtonPress(command)}
        style={{backgroundColor: '#0066FF'}}
      >
        Run Docker Pull
      </Button>}
      {showTerminal && <ScrollToBottomWrapper
        ref={terminalRef} 
        className="terminalWindow" 
      >
        {/* Display the terminal output */}
        {Array.from(new Set(output)).map((item, index) => (
          <div key={index} style={{whiteSpace: 'nowrap'}}>&gt; {item}</div>
        ))}
      </ScrollToBottomWrapper>}
      {imageExists && <Box display='flex' justifyContent='space-between' alignContent='center'>
      <Box display='flex' justifyContent='flex-start' alignContent='center'>
        <CheckCircleIcon sx={{color: '#2FB600'}} />
        <Typography style={{fontSize: '0.8rem', lineHeight: '2'}}>Docker Image Downloaded</Typography>
      </Box>
        {showTerminal && <Button size='small' onClick={() => setShowTerminal(false)}>Hide Terminal</Button>}
      </Box>}
  </>
  );
};

export default TerminalWindow;
