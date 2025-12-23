import { NextResponse } from "next/server";

const errorHandler = (error: any) => {
  // Error de duplicado Prisma
  if (error.code === "P2002") {
    return NextResponse.json(
      { error: `El campo ${error.meta.target} ya está en uso` },
      { status: 409 }
    )
  }

  // Error de si no se encuenta el recurso
  // Por ejemplo: buscar un usuario que no exista
  if (error.code === 'P2025') {
    return NextResponse.json(
      { error: 'Recurso no encontrado' },
      { status: 404 }
    )
  }

  if (error.message === 'sin autorizacion') {
    return NextResponse.json({ error: "Sin autorización" }, { status: 401 })
  }

  if (error.message === 'ID invalido') {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  if(error.message === 'no encontrado') {
    return NextResponse.json({error:'No encontrado'},{status:404})
  }

  // Otros errores
  return NextResponse.json({ error: error.message }, { status: 500 })
}

export default errorHandler
