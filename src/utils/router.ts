import {adminRoutes, dynamicRoutes} from '@/router/index';
import {RouteRecordRaw} from 'vue-router';

/**
 * 路由拼接展示
 * @param dataBaseRouters
 */
export function getRouterToShow(dataBaseRouters: any[]) {

  return dynamicRoutes;

  // return getFirMenuList()

  /**
   * 获取一级菜单
   */
  function getFirMenuList() {
    const routerResult: any[] = [];
    // 数据库中的路由循环
    dataBaseRouters.forEach(item => {
      let r = dynamicRoutes.find(i => i.name === item.name);
      if (r) {
        let data:any = {...r};
        data.meta.title = item.meta.title;
        data.meta.menuOrder = item.meta.menuOrder;
        data.children = getRouterChildren(item, r);
        routerResult.push(data);
      }
    });
    return routerResult;
  }

  /**
   * 获取路由子项
   * @param dataChildren
   * @param staticChildren
   */
  function getRouterChildren(dataRouter: any, staticRouter: any) {
    const dRounter: any[] = dataRouter.children;
    const sRounter: any[] = staticRouter?.children;
    const subRouteList: any[] = [];
    dRounter.forEach(item => {
      const r = sRounter.find(subItem => {
        return subItem.name === item.name;
      });
      if (r) {
        let data = {...r};
        data.meta = item.meta;
        subRouteList.push(r);
      }
    });
    return subRouteList;
  }


}


/**
 * 将菜单变成层级结构
 * @param routerList
 */
export function routerListToRank(routerList: any[]) {

  return firMenuList(routerList);

  /**
   * 获取一级菜单
   *
   * @param menuList
   */
  function firMenuList(menuList: any[]) {
    const firMenu = menuList.filter(i => i.fid === 0).map(i => {
      const menu = {
        name: i.name,
        meta: {
          title: i.title,
          icon: i.icon,
          menuOrder: i.icon
        },
        children: secMenuList(i, routerList)
      };
      return menu;
    });
    return firMenu;
  }

  /**
   * 获取二级菜单
   * @param firMenu
   * @param menuList
   */
  function secMenuList(firMenu: any, menuList: any[]) {
    const secMenuList = menuList.filter(i => {
      return i.fid === firMenu.id;
    }).map(i => {
      const data = {
        name: i.name,
        meta: {
          title: i.title,
          icon: i.icon,
          menuOrder: i.menuOrder,
          btnPermissions: getBtnPer(i.menubuttonList)
        }
      };
      return data;
    });
    return secMenuList;
  }

  /**
   * 转换按钮
   * @param btnList
   */
  function getBtnPer(btnList: any[]) {
    let perBtnList: any[] = [];
    if (btnList != null && btnList.length != 0) {
      perBtnList = btnList.map(item => {
        return {title: item.name, type: item.type};
      });
    }
    return perBtnList;
  }

}


/**
 * 过滤同步异步组建
 * @param routes
 */
export const filterAsyncRoute = (routes: any[]) => {
  return getFirMenuList(routes);
  // 过滤出一级菜单

  function getFirMenuList(routes: any[]) {
    let menuList: any[] = [];
    routes.forEach(routerItem => {
      if (routerItem.fid === 0) {
        const firMenuItem: any = dynamicRoutes.find(i => {
          return i?.name?.toLowerCase() === routerItem.name.toLowerCase();
        });
        // 设置二级菜单
        firMenuItem.children = getSecMenuList(firMenuItem.children, routes);
        menuList.push(firMenuItem);
      }
    });
    return menuList;

    function getSecMenuList(menuChildrenList: any[], routes: any[]) {
      let menuList: any[] = [];
      if (menuChildrenList.length === 0)
        return menuList;
      routes.forEach(item => {
        if (item.fid !== 0) {
          const chindrenMenu = menuChildrenList.find(i => {
            return i.name.toLowerCase() === item.name.toLowerCase();
          });
          if (typeof (chindrenMenu) !== 'undefined') {
            // 设置按钮
            chindrenMenu.btnPermissions = getBtn(chindrenMenu.meta.btnPermissions, item.menubuttonList);
            menuList.push(chindrenMenu);

          }
        }
      });

      /**
       * 获取按钮权限
       * @param staMenu
       * @param dyMenu
       */
      function getBtn(staMenu: any[], dyMenu: any[]) {
        const btnList: any[] = [];
        dyMenu.forEach(item => {
          const btn = staMenu.find(i => i.type === item.type);
          btnList.push(btn);
        });
        return btnList;
      }

      return menuList;
    }

  }
};


/**
 * 转换菜单的按钮权限
 * @param mentBtnList
 */
export function changePeriBtnList(mentBtnList: any[]) {
  return mentBtnList.map(item => {
    return {
      name: item.name,
      menubuttonList: changeBtnList(item.menubuttonList)
    }
  })

  /**
   * 转换按钮
   * @param btnList
   */
  function changeBtnList(btnList: any[]) {
    return btnList.map(item => {
      return {
        name: item.name,
        type: item.type
      }
    })
  }
}
