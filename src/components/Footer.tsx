
import { Link } from 'react-router-dom';
import { useLanguage } from "@/lib/language-context";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="font-serif font-bold text-2xl mb-4">NewsPortal</h2>
            <p className="mb-4">
              {t('footer.about')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-actionRed transition-colors">Facebook</a>
              <a href="#" className="hover:text-actionRed transition-colors">Twitter</a>
              <a href="#" className="hover:text-actionRed transition-colors">Instagram</a>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-4">{t('footer.categories')}</h3>
            <ul className="space-y-2">
              <li><Link to="/category/politique" className="hover:text-actionRed transition-colors">{t('nav.politique')}</Link></li>
              <li><Link to="/category/economie" className="hover:text-actionRed transition-colors">{t('nav.economie')}</Link></li>
              <li><Link to="/category/tech" className="hover:text-actionRed transition-colors">{t('nav.tech')}</Link></li>
              <li><Link to="/category/sport" className="hover:text-actionRed transition-colors">{t('nav.sport')}</Link></li>
              <li><Link to="/category/culture" className="hover:text-actionRed transition-colors">{t('nav.culture')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-4">{t('footer.useful.links')}</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-actionRed transition-colors">{t('footer.about.link')}</Link></li>
              <li><Link to="/contact" className="hover:text-actionRed transition-colors">{t('footer.contact')}</Link></li>
              <li><Link to="/privacy" className="hover:text-actionRed transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/terms" className="hover:text-actionRed transition-colors">{t('footer.terms')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-4">{t('footer.newsletter')}</h3>
            <p className="mb-4">
              {t('footer.newsletter.desc')}
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder={t('footer.newsletter.placeholder')} 
                className="px-4 py-2 border rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-actionRed"
              />
              <button className="bg-actionRed text-white px-4 py-2 rounded-r-md hover:bg-actionRed-hover transition-colors">
                OK
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; {currentYear} NewsPortal. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
