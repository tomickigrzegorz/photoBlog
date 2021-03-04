import 'styles/modules/_article.scss';
import 'styles/style.scss';

import DisqusLoader from './modules/Disqusloader';
import ShareButton from './modules/ShareButton';

// import './share';

const sharebutton = new ShareButton();
sharebutton.initial();

const disqusloader = new DisqusLoader();
disqusloader.initial();
