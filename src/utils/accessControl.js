export const checkAccessComponent = (menuName, pageName,componentName ) => {
    const storedRoleData = localStorage.getItem("roleData");
    if (!storedRoleData) return false;

    const parsedData = JSON.parse(storedRoleData);

    if (!parsedData || !parsedData.menus) {
      //  console.error("❌ Role Data is missing or incorrect:", parsedData);
        return false;
    }
    // console.log("parsedData",parsedData);
    const hasAccess = parsedData.menus.some((menu) =>
        menu.menuName === menuName &&
        menu.pages.some((page) =>
            page.pageName === pageName &&
            page.components?.some((component) => component.componentName === componentName)
        )
    );

   /*  console.log(
        hasAccess
            ? `✅ Access granted to component: ${componentName} on ${pageName} under ${menuName}`
            : `❌ No access to component: ${componentName} on ${pageName} under ${menuName}`
    ); */

    return hasAccess;
};

export const checkAccess = (menuName, pageName) => {
    const storedRoleData = localStorage.getItem("roleData");
    if (!storedRoleData) return false;

    const parsedData = JSON.parse(storedRoleData);

    if (!parsedData || !parsedData.menus) {
      //  console.error("❌ Role Data is missing or incorrect:", parsedData);
        return false;
    }

    const hasAccess = parsedData.menus.some(
        (menu) => menu.menuName === menuName &&
            menu.pages.some((page) => page.pageName === pageName)
    );

   /*  console.log(
        hasAccess
            ? `✅ Access granted to ${pageName} under ${menuName}`
            : `❌ No access to ${pageName} under ${menuName}`
    ); */

    return hasAccess;
};

export const checkAccessMenu = (menuName) => {
    const storedRoleData = localStorage.getItem("roleData");
    if (!storedRoleData) return false;

    const parsedData = JSON.parse(storedRoleData);

    if (!parsedData || !parsedData.menus) {
       // console.error("❌ Role Data is missing or incorrect:", parsedData);
        return false;
    }

    const hasAccess = parsedData.menus.some((menu) => menu.menuName === menuName);

   /*  console.log(
        hasAccess
            ? `✅ Access granted to ${menuName}`
            : `❌ No access to ${menuName}`
    ); */

    return hasAccess;
};
