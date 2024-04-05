import React from 'react'
import { Card, Button } from 'antd'

const Connection = ({ connect, disconnect, connectBtn }) => {
  const ConnectionOptions = {
    protocol: 'wss',
    host: '3f9a8a7ae59c4ab98a5d8498ff0a646d.s1.eu.hivemq.cloud',
    clientId: 'admin',
    port: 8884,
    username: 'rynoo',
    password: 'Rp123456',
  }

  const handleConnect = () => {
    const { protocol, host, clientId, port, username, password } = ConnectionOptions
    const url = `${protocol}://${host}:${port}/mqtt`
    const options = {
      clientId,
      username,
      password,
      clean: true,
      reconnectPeriod: 1000, // ms
      connectTimeout: 30 * 1000, // ms
    }
    connect(url, options)
  }

  const handleDisconnect = () => {
    disconnect()
  }

  return (
    <Card
      style={{width: '80%', height: '80%'}}
      title="Connection"
    >
      <Button type="primary" onClick={handleConnect}>
        {connectBtn}
      </Button>,
      <Button danger onClick={handleDisconnect}>
        Disconnect
      </Button>
    </Card>
  )
}

export default Connection