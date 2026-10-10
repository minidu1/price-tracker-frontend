import "./Signup.css"

export default function Signup(){
    return (
        <div className="signup">
    <h2>Sign up</h2>

    <form>
        <div className="form-group">
            <label for="name">Name</label>
            <input id="name" type="text" />
        </div>

        <div className="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" />
        </div>

        <div className="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" />
        </div>

        <button type="submit">Sign up</button>
    </form>
</div>
    )
}