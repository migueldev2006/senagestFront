import { axiosAPI } from '@/api/axiosAPI'
import { useState } from 'react'

export function usePiscicultura() {
  const [loading, setLoading] = useState(false)

  const validarBroker = async (data: any) => {
    setLoading(true)
    const res = await axiosAPI.post('/psicultura/validar', data)
    setLoading(false)
    return res.data
  }

  const actualizarTimer = async (id: number, data: any) => {
    setLoading(true)
    const res = await axiosAPI.patch(`/psicultura/timer/${id}`, data)
    setLoading(false)
    return res.data
  }

  const cambiarEstado = async (id: number, estado: boolean) => {
    setLoading(true)
    const res = await axiosAPI.patch(`/psicultura/estado/${id}`, { estado })
    setLoading(false)
    return res.data
  }

  const obtenerEstado = async (id: number) => {
    setLoading(true)
    const res = await axiosAPI.get(`/psicultura/estado/${id}`)
    setLoading(false)
    return res.data.estado
  }

  return { validarBroker, actualizarTimer, cambiarEstado, obtenerEstado, loading }
}
