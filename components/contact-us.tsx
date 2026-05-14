import { SOCIAL_MEDIA } from "@/constants/contact-us";
import { IconExternalLink } from "@tabler/icons-react";

const ContactUs = () => {
  return (
    <div className="mb-48 flex flex-col items-center gap-10 px-2">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-primary">
        Connect <span className="text-secondary">with Us</span>
      </h1>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {SOCIAL_MEDIA.map(
          ({
            title,
            username,
            icon: Icon,
            cardHoverClass,
            iconHoverClass,
            href,
            linkLabel,
            classNames = "",
          }) => (
            <a
              key={`${title}-${username}`}
              aria-label={linkLabel}
              className={`group flex min-h-28 items-center gap-3 rounded-2xl border-3 border-primary/50 bg-background px-4 py-3 pr-8 text-center transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:pr-12 ${cardHoverClass} ${classNames}`}
              href={href}
              rel="noreferrer"
              target="_blank"
            >
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-transparent bg-muted text-primary shadow-sm transition-all duration-300 group-hover:scale-105 dark:text-white ${iconHoverClass}`}
              >
                <Icon size={30} stroke={1.75} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                <p className="text-base font-bold">{title}</p>
                <p className="text-sm text-foreground transition-colors duration-300 group-hover:text-current dark:text-white">
                  {username}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors duration-300 group-hover:text-current dark:text-white">
                  View
                  <IconExternalLink
                    className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    size={18}
                  />
                </span>
              </div>
            </a>
          ),
        )}
      </div>
    </div>
  );
};

export default ContactUs;
