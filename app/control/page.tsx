"use client"

import { useEffect, useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LockIcon, UnlockIcon } from "lucide-react"

const Loader = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full border-8 border-t-8 border-gray-300 border-t-blue-500 w-16 h-16"></div>
        <p className="mt-4 text-gray-700">Loading...</p>
      </div>
    );
  };
// For locking the door
const lockDoor = async () => {
    const response = await fetch(
      `https://blynk.cloud/external/api/update?token=5AghjIFlYn6nUxOr3dPlxC7D3RoUF1f7&dataStreamId=1&value=1`
    );
    console.log(response)
   
  };
  
  // For unlocking the door
  const unlockDoor = async () => {
    const response = await fetch(
      `https://blynk.cloud/external/api/update?token=5AghjIFlYn6nUxOr3dPlxC7D3RoUF1f7&dataStreamId=1&value=0`
    );
   console.log(response)
   
  };
  
export default function DeviceToggle() {
    const [isDoorOpen,setIsDoorOpen]=useState(false);
    const [loading,isLoading]=useState(true)
    

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(
              `https://blynk.cloud/external/api/get?token=5AghjIFlYn6nUxOr3dPlxC7D3RoUF1f7&dataStreamId=2`
            );
            const response1 = await fetch(
              `https://blynk.cloud/external/api/get?token=5AghjIFlYn6nUxOr3dPlxC7D3RoUF1f7&dataStreamId=1`
            );
    
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
    
            const data = await response.text();
            const data1 = await response1.text();
    
            // Assuming the response data contains the state you need
            const doorState = data; // Adjust according to your API response structure
            console.log(doorState)
            setIsDoorOpen(doorState === '1');
            setIsLocked(data1 === '1') // Assuming '1' means open, adjust as necessary
    
          } catch (error) {
            console.error('Error fetching door state:', error);
          }
          finally{
            isLoading(false)
          }
        };
    
        // Fetch data initially
        fetchData();
    
        // Set up an interval to fetch data every 5 seconds
        const intervalId = setInterval(fetchData, 2000);
    
        // Cleanup function to clear the interval on component unmount
        return () => clearInterval(intervalId);
      }, []);
  const [isLocked, setIsLocked] = useState(true)

  const handleToggle = async() => {
    if(isLocked){
       await unlockDoor()
    }
    else{
        await lockDoor()
    }
    setIsLocked(!isLocked)
    // Here you would typically send a request to your backend or IoT device
    console.log(`Device is now ${!isLocked ? 'locked' : 'unlocked'}`)
  }
  if (loading) {
    return <Loader />; // Show the loader while fetching data
  }
  return (
    <div className="min-h-screen text-center flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">SmartLock Control</CardTitle>
          <CardDescription className="text-center">Toggle your device on or off</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            {isLocked ? (
              <LockIcon className="h-24 w-24 text-green-500" />
            ) : (
              <UnlockIcon className="h-24 w-24 text-red-500" />
            )}
            <p className="text-xl font-semibold">
              Status: {isLocked ? 'Locked' : 'Unlocked'}
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Switch
              id="device-toggle"
              checked={!isLocked}
              onCheckedChange={handleToggle}
              disabled={isDoorOpen}
            />
            <Label htmlFor="device-toggle">
              {isLocked ? 'Unlock Device' : 'Lock Device'}
            </Label>
            
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
        {isDoorOpen && <div className='text-red-600 font-bold font-xl'>You cant lock or unlock because the door is open</div>}
        </CardFooter>
      </Card>
    </div>
  )
}