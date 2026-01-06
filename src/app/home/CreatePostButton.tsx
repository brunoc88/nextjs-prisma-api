'use client'

import { useRouter } from 'next/navigation'

// creamos un componente tipo cliente para manejar el evento
// ya que el componente home es server component 
// por lo que no se puede usar router.push

const CreatePostButton = () => {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/post')}>
      Crear Post
    </button>
  )
}

export default CreatePostButton
