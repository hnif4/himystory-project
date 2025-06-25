import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page.js';
import RegisterPage from '../pages/auth/register/register-page.js';
import LoginPage from '../pages/auth/login/login-page';
import AddStoryPage from '../pages/add-story/add-story-page.js';


const routes = {
  '/register': () => new RegisterPage(),
  '/login': () => new LoginPage(),
  '/': () => new HomePage(),       
  '/story/:id': () => new StoryDetailPage(),       
  '/about': () => new AboutPage(),  
  '/add': () => new AddStoryPage(),

};

export default routes;
