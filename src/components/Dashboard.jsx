export default function Dashboard({onLogout, user}) {
    return(
        <>
        <p>this is dashboard</p>
        <p>hello {user.name}</p>
        <button onClick={onLogout}>Logout</button>
        </>
    
    )
}