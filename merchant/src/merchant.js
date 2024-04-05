import React, { useEffect, useState } from 'react'
import mqtt from 'mqtt'
import Connection from './connection';
import { Button, Card } from 'antd'

const Merchant = () => {
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState('Connect')
  const [announcement, setAnnouncement] = useState()
  const [start, setStart] = useState(0)

  const mqttConnect = (host, mqttOption) => {
    setConnectStatus('Connecting');
    setClient(mqtt.connect(host, mqttOption));
  };
  useEffect(() => {
    if (client) {
      console.log(client)
      client.on('connect', () => {
        setConnectStatus('Connected');
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      client.on('message', (topic, message) => {
        console.log(`received message: ${message} from topic: ${topic}`)
        if (topic === 'esp32/saldo') {
          setAnnouncement(getDate() + " > SALDO AWAL ANDA Rp." + message.toString())
        }

        if (topic === 'esp32/transaksi') {
          if (message.toString() === '-1') {
            setAnnouncement(getDate() + " > SALDO TIDAK MENCUKUPI")
          } else {
            setAnnouncement(getDate() + " > TRANSAKSI BERHASIL, SISA SALDO Rp." + message.toString())
          }
        }
      })
    }
  }, [client]);

  const handleStart = () => {
    mqttSub('esp32/saldo')
    mqttSub('esp32/transaksi')
    setStart(1)
  }

  const mqttDisconnect = () => {
    setStart(0);
    setAnnouncement("");
    if (client) {
      try {
        client.end(false, () => {
          setConnectStatus('Connect')
          console.log('disconnected successfully')
        })
      } catch (error) {
        console.log('disconnect error:', error)
      }
    }
  }

  const mqttSub = (topic) => {
    if (client) {
      // subscribe topic
      client.subscribe(topic, (error) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        console.log(`Subscribed to topics: ${topic}`)
      })
    }
  }

  // const mqttPublish = (topic, message) => {
  //   if (client) {
  //     // topic, QoS & payload for publishing message
  //     client.publish(topic, JSON.stringify(message), (error) => {
  //       if (error) {
  //         console.log('Publish error: ', error)
  //       }
  //       console.log(`Published to topics: ${topic}`)
  //     })
  //   }
  // }

  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const hour = today.getHours();
    const min = today.getMinutes();
    const sec = today.getSeconds();
    return `${date}/${month}/${year} ${hour}:${min}:${sec}`;
  }

  return (
    <>
      <Connection
        connect={mqttConnect}
        disconnect={mqttDisconnect}
        connectBtn={connectStatus}
        />
      <Button style={{marginTop:20}} type="primary" onClick={handleStart}>
        Mulai
      </Button>
      {start === 1 && 
        <Card
        style={{marginTop:20}}
          title="Message"
        >
          {announcement}
        </Card>
      }
    </>
  )
}

export default Merchant