import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'vi',
  setLanguage: () => { },
  toggleLanguage: () => { },
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  vi: {
    'nav.home': 'Trang chủ',
    'nav.login': 'Đăng nhập',
    'nav.register': 'Đăng ký',
    'nav.logout': 'Đăng xuất',
    'nav.profile': 'Hồ sơ',
    'nav.settings': 'Cài đặt',
    'footer.rights': 'Bản quyền thuộc về',
    'footer.terms': 'Điều khoản sử dụng',
    'footer.privacy': 'Chính sách bảo mật',
    'footer.contact': 'Liên hệ',
    'footer.about': 'Nguồn tin tức đáng tin cậy của bạn, cung cấp tin tức mới nhất từ khắp nơi trên thế giới.',
    'footer.about.link': 'Về chúng tôi',
    'footer.categories': 'Danh mục',
    'footer.useful.links': 'Liên kết hữu ích',
    'footer.newsletter': 'Bản tin',
    'footer.newsletter.desc': 'Đăng ký nhận bản tin để cập nhật tin tức mới nhất.',
    'footer.newsletter.placeholder': 'Nhập email của bạn',
    'home.featured': 'Nổi bật',
    'home.latest': 'Tin mới nhất',
    'home.popular': 'Bài viết phổ biến',
    'home.trending': 'Xu hướng',
    'article.related': 'Bài viết liên quan',
    'article.published': 'Xuất bản ngày',
    'article.updated': 'Cập nhật ngày',
    'article.by': 'Bởi',
    'article.comments': 'Bình luận',
    'article.share': 'Chia sẻ',
    'article.save': 'Lưu',
    'article.read_more': 'Đọc thêm',
    'category.all': 'Tất cả danh mục',
    'no.articles.found': 'Không tìm thấy bài viết',
    'login.title': 'Đăng nhập',
    'login.email': 'Email',
    'login.password': 'Mật khẩu',
    'login.forgot': 'Quên mật khẩu?',
    'login.submit': 'Đăng nhập',
    'login.register': 'Chưa có tài khoản? Đăng ký',
    'register.title': 'Tạo tài khoản',
    'register.name': 'Họ tên',
    'register.email': 'Email',
    'register.password': 'Mật khẩu',
    'register.confirm': 'Xác nhận mật khẩu',
    'register.submit': 'Đăng ký',
    'register.login': 'Đã có tài khoản? Đăng nhập',
    'theme.light': 'Sáng',
    'theme.dark': 'Tối',
    'theme.system': 'Hệ thống',
    'error.not_found': 'Không tìm thấy trang',
    'error.go_home': 'Về trang chủ',
    'commenting.write': 'Viết bình luận',
    'commenting.post': 'Đăng',
    'commenting.cancel': 'Hủy',
    'news.author': 'Tác giả',
    'news.section.heading': 'Mục',
    'news.conclusion': 'Kết luận',
    'nav.politique': 'Chính trị',
    'nav.economie': 'Kinh tế',
    'nav.sport': 'Thể thao',
    'nav.tech': 'Công nghệ',
    'nav.culture': 'Văn hóa',
    'nav.science': 'Khoa học',
    'search': 'Tìm kiếm',
    'search.placeholder': 'Tìm kiếm bài viết...',
    'search.results': 'Kết quả tìm kiếm',
    'search.results.for': 'Kết quả cho "{query}"',
    'search.no.results': 'Không có kết quả',
    'search.no.results.found': 'Không tìm thấy kết quả nào',
    'search.found.results': 'Tìm thấy {count} kết quả',
    'search.enter.query': 'Nhập từ khóa để bắt đầu tìm kiếm',
    'search.view.all': 'Xem tất cả {count} kết quả',
    'password.reset.title': 'Đặt lại mật khẩu',
    'password.reset.header': 'Quên mật khẩu',
    'password.reset.enter_email': 'Nhập địa chỉ email để nhận liên kết đặt lại mật khẩu.',
    'password.reset.submit': 'Gửi liên kết đặt lại',
    'password.reset.sending': 'Đang gửi...',
    'password.reset.sent': 'Đã gửi email',
    'password.reset.check_email': 'Kiểm tra hộp thư để xem hướng dẫn đặt lại.',
    'password.reset.back_to_login': 'Quay lại đăng nhập',
    'password.reset.instructions_sent': 'Hướng dẫn đặt lại đã được gửi đến email của bạn.',
    'password.reset.success_message': 'Nếu tài khoản tồn tại với email này, bạn sẽ nhận được liên kết để đặt lại mật khẩu.',
    'login.remember_password': 'Nhớ mật khẩu của bạn?',
    'error.missing_fields': 'Thiếu trường thông tin',
    'error.provide_email': 'Vui lòng cung cấp địa chỉ email.',
    'news.article.not.found': 'Không tìm thấy bài viết',
    'news.article.not.found.desc': 'Xin lỗi, bài viết bạn tìm không tồn tại.',
    'contact.title': 'Liên hệ với chúng tôi',
    'contact.subtitle': 'Có câu hỏi? Gợi ý? Đừng ngần ngại liên hệ với chúng tôi.',
    'contact.info': 'Thông tin liên hệ',
    'contact.form.title': 'Gửi tin nhắn cho chúng tôi',
    'contact.form.name': 'Họ và tên',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Chủ đề',
    'contact.form.message': 'Tin nhắn',
    'contact.form.submit': 'Gửi tin nhắn',
    'contact.form.sending': 'Đang gửi...',
    'contact.success': 'Đã gửi tin nhắn',
    'contact.success.desc': 'Chúng tôi sẽ phản hồi bạn sớm nhất có thể.'
  },
  en: {
    'nav.home': 'Home',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'footer.rights': 'All rights reserved',
    'footer.terms': 'Terms of Use',
    'footer.privacy': 'Privacy Policy',
    'footer.contact': 'Contact',
    'footer.useful.links': 'Useful Links',
    'footer.categories': 'Categories',
    'footer.newsletter': 'Newsletter',
    'footer.about': 'Your trusted source for news, delivering the latest stories from around the world.',
    'footer.about.link': 'About Us',
    'footer.newsletter.desc': 'Subscribe to our newsletter to get the latest news and updates.',
    'footer.newsletter.placeholder': 'Enter your email',
    'home.featured': 'Featured',
    'home.latest': 'Latest News',
    'home.popular': 'Popular Articles',
    'home.trending': 'Trending',
    'home.hero.title': "Today's Top Stories",
    'home.hero.description': 'Stay updated with the latest, accurate and useful news.',
    'home.hero.button.today': 'Today',
    'home.hero.button.explore': 'Explore',
    'home.hero.button.view_all': 'View All',
    'latest.news': 'Latest News',
    'popular.articles': 'Popular Articles',
    'read.more': 'Read More',
    'category.technology.desc': 'Latest news and updates in technology',
    'article.related': 'Related Articles',
    'article.published': 'Published on',
    'article.updated': 'Updated on',
    'article.by': 'By',
    'article.comments': 'Comments',
    'article.share': 'Share',
    'article.save': 'Save',
    'article.read_more': 'Read more',
    'category.all': 'All Categories',
    'no.articles.found': 'No articles found',
    'login.title': 'Login',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.forgot': 'Forgot password?',
    'login.submit': 'Sign In',
    'login.register': 'Don\'t have an account? Register',
    'register.title': 'Create an account',
    'register.name': 'Name',
    'register.email': 'Email',
    'register.password': 'Password',
    'register.confirm': 'Confirm password',
    'register.submit': 'Register',
    'register.login': 'Already have an account? Login',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'error.not_found': 'Page Not Found',
    'error.go_home': 'Go back home',
    'commenting.write': 'Write a comment',
    'commenting.post': 'Post',
    'commenting.cancel': 'Cancel',
    'news.author': 'Author',
    'news.section.heading': 'Section',
    'news.conclusion': 'Conclusion',
    'nav.politique': 'Politics',
    'nav.economie': 'Economy',
    'nav.sport': 'Sports',
    'nav.tech': 'Technology',
    'nav.culture': 'Culture',
    'nav.science': 'Science',
    'search': 'Search',
    'search.placeholder': 'Search articles...',
    'search.results': 'Search Results',
    'search.results.for': 'Results for "{query}"',
    'search.no.results': 'No results',
    'search.no.results.found': 'No results found for your search',
    'search.found.results': '{count} results found',
    'search.enter.query': 'Enter a search term to begin',
    'search.view.all': 'View all {count} results',
    'password.reset.title': 'Password Reset',
    'password.reset.header': 'Forgot Password',
    'password.reset.enter_email': 'Enter your email address to receive a password reset link.',
    'password.reset.submit': 'Send Reset Link',
    'password.reset.sending': 'Sending...',
    'password.reset.sent': 'Email Sent',
    'password.reset.check_email': 'Check your inbox for reset instructions.',
    'password.reset.back_to_login': 'Back to Login',
    'password.reset.instructions_sent': 'Reset instructions have been sent to your email address.',
    'password.reset.success_message': 'If an account exists with this email address, you will receive a link to reset your password.',
    'login.remember_password': 'Remember your password?',
    'error.missing_fields': 'Missing Fields',
    'error.provide_email': 'Please provide your email address.',
    'news.article.not.found': 'Article Not Found',
    'news.article.not.found.desc': 'Sorry, the article you are looking for does not exist.',
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Have a question? A suggestion? Don\'t hesitate to contact us.',
    'contact.info': 'Contact Information',
    'contact.form.title': 'Send us a message',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.success': 'Message Sent',
    'contact.success.desc': 'We will get back to you as soon as possible.'
  }
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('vi');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    let translation = translations[language][key as keyof typeof translations['vi']] || key;

    if (replacements) {
      Object.entries(replacements).forEach(([name, value]) => {
        translation = translation.replace(`{${name}}`, String(value));
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};