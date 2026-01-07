import PostFormPage from "../page"

const Edit = async (context:{params:Promise<{ id: string }>}) => {

    let {id} = await context.params
    const paramId = Number(id)
    return(
        <div>
            <PostFormPage id={paramId}/>
        </div>
    )
}

export default Edit