import Link from 'next/link'
import PropTypes from 'prop-types'

const linkStyle = {
  marginRight: 15
}


const Login = ()=>{
  return <Link href="/login">
    <a style={linkStyle}>Login</a>
  </Link>
}

const Logout = (props)=>{
  return <a style={linkStyle} onClick={() => {
  }}>{props.username} logout</a>
}

const Header = (props) => {
  
  return (
    <div>
        <Link href="/">
          <a style={linkStyle}>Home</a>
        </Link>
        <Link href="/about">
          <a style={linkStyle}>About</a>
        </Link>
        {(props.user && props.user.username)?<Logout username={props.user.username} />:<Login />}
    </div>
  )
} 



export default Header
