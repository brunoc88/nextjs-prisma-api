import { postService } from "@/services/post.service"
import { requireSessionUserId } from "@/lib/auth/requireSessionUserId"

const BlogList = async () => {
  const userId = await requireSessionUserId()

  if (!userId) {
    return <p>Sin acceso, necesario loguearse</p>
  }

  const blogs = await postService.findAll()

  return (
    <div>
      <h1>Listado de Posts</h1>

      {blogs.map((p) => (
        <ul key={p.id}>
          <li>
            <div>
              <p><b>Título:</b> {p.title}</p>
              <p><b>Contenido:</b> {p.content}</p>
              <p><b>Autor:</b> {p.user.email}</p>
            </div>
          </li>
        </ul>
      ))}
    </div>
  )
}

export default BlogList
