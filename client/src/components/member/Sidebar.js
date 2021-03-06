import React from 'react'
import {Link} from 'react-router-dom'
import '../../style/HS.scss'


function Sidebar(props) {
    return <>
        {/* Sidebar */}
        <div>
            <img className="rounded-circle avatar mb-5" src={'http://127.0.0.1:5000/images/memberImg/' + props.SidebarImgSrc} alt=""></img>
        </div>
        <ul className="nav flex-column hssidebar" style={{ width: "150px" }}>
            <li className="nav-item">
                <Link className="nav-link sidebarlink-hs" to="/memberhomepage"><i className="fas fa-home"></i>首頁</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link sidebarlink-hs" to="/memberuser"><i className="far fa-user"></i>個人資料</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link sidebarlink-hs" to="/memberorder"><i className="fas fa-receipt"></i>我的訂單</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link sidebarlink-hs" to="/memberclass"><i className="far fa-calendar-alt"></i>我的課程</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link sidebarlink-hs" to="/memberevent"><i className="fas fa-swimmer"></i>我的活動</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link sidebarlink-hs" to="/memberblog"><i className="far fa-edit"></i>我的PO文</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link sidebarlink-hs" to="/membermessage"><i className="far fa-envelope"></i>訊息管理</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link sidebarlink-hs" to="/help"><i className="far fa-question-circle"></i>幫助</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link sidebarlink-hs" to="/"><i className="fas fa-sign-out-alt"></i>登出</Link>
            </li>
        </ul>
    </>
}

export default Sidebar