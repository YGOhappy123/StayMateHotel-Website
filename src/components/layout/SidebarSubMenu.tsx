import { Fragment, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { MOTION_EFFECTS } from '@/components/layout/Sidebar'

type SubMenuProps = {
    label: string
    Icon: IconDefinition
    items: {
        label: string
        navigation: string
    }[]
}

const SidebarSubMenu = ({ label, Icon, items }: SubMenuProps) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)
    const { pathname } = useLocation()

    return (
        <Fragment>
            <li className={`link ${pathname.includes(label) && 'text-blue-600'}`} onClick={() => setIsSubMenuOpen(prev => !prev)}>
                <div className="flex w-6 justify-center">
                    <FontAwesomeIcon icon={Icon} className="min-w-max" size="lg" />
                </div>
                <p className="flex-1">{label}</p>
                <FontAwesomeIcon icon={faChevronDown} className={` ${isSubMenuOpen && 'rotate-180'} duration-200`} />
            </li>

            <motion.ul
                animate={isSubMenuOpen ? MOTION_EFFECTS.openSubMenu : MOTION_EFFECTS.closeSubMenu}
                className="flex h-0 flex-col overflow-hidden pl-14 text-[0.8rem] font-normal"
            >
                {items?.map(menu => (
                    <li key={menu.navigation} className="hover:font-medium hover:text-blue-600">
                        <NavLink to={`/dashboard/${menu.navigation}`} className="link !bg-transparent">
                            {menu.label}
                        </NavLink>
                    </li>
                ))}
            </motion.ul>
        </Fragment>
    )
}

export default SidebarSubMenu
