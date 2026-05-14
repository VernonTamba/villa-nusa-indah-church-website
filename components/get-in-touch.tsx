"use client";

import { Card, CardBody } from "@heroui/react";

import { CONTACT_OPTIONS } from "@/constants/get-in-touch";

const DIRECT_CONTACT_OPTIONS = CONTACT_OPTIONS.slice(0, 2);
const SOCIAL_CONTACT_OPTIONS = CONTACT_OPTIONS.slice(2);

const CONTACT_CARD_CLASS =
  "relative w-full cursor-pointer overflow-hidden border border-primary bg-white transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.02] group-hover:shadow-[0_18px_42px_rgba(1,75,63,0.2)] dark:border-white/20 dark:bg-transparent dark:group-hover:shadow-[0_18px_42px_rgba(248,167,36,0.14)]";

const CONTACT_CARD_BODY_CLASS =
  "flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(1,75,63,0.12),_transparent_60%),linear-gradient(180deg,_rgba(248,167,36,0.1),_rgba(255,255,255,0.96))] dark:bg-[radial-gradient(circle_at_top,_rgba(248,167,36,0.2),_transparent_55%),linear-gradient(180deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))]";

const GetInTouch = () => {
  return (
    <div
      id="get-in-touch"
      className="mb-48 flex scroll-mt-24 flex-col items-center gap-10 px-2"
    >
      <div className="text-center mx-auto max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-6">
            <h1
              id="core-values-heading"
              className="text-5xl font-black tracking-tight text-primary"
            >
              Get in Touch <span className="text-secondary">with Us</span>
            </h1>
            <p className="mt-4 text-sm leading-7 text-foreground dark:text-white sm:text-base">
              Feel free to reach out to us through any of the methods. Whether
              you want to send: prayer requests, inquiries, or just a simple
              greeting, we're here to listen and connect with you. We look
              forward to hearing from you!
            </p>
          </div>
        </div>
      </div>
      {/* <div className="flex w-full max-w-2xl flex-col">
        <p className="mb-6 text-center text-sm leading-6 text-foreground dark:text-white">
          Feel free to reach out to us through any of the methods. Whether you
          want to send: prayer requests, inquiries, or just a simple greeting,
          we're here to listen and connect with you. We look forward to hearing
          from you!
        </p>

        <div className="flex gap-3">
          {CONTACT_MESSAGE_TYPES.map((type) => (
            <div key={type} className="my-1 flex w-full items-center">
              <Alert
                className="py-1"
                color="success"
                title={type}
                variant="faded"
              />
            </div>
          ))}
        </div>
      </div> */}

      <div className="flex w-full max-w-6xl flex-col items-center gap-10">
        <div className="grid w-full max-w-3xl grid-cols-1 justify-items-center gap-5 sm:grid-cols-2">
          {DIRECT_CONTACT_OPTIONS.map(
            ({ description, href, linkLabel, icon: Icon }) => (
              <a
                key={`${linkLabel}-${description}`}
                aria-label={linkLabel}
                className="group block w-full max-w-[300px] rounded-large focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                href={href}
                rel="noreferrer"
                target="_blank"
              >
                <Card className={CONTACT_CARD_CLASS} radius="lg">
                  <CardBody className={`${CONTACT_CARD_BODY_CLASS} px-5 py-7`}>
                    <div className="flex min-w-0 flex-col items-center justify-center gap-4">
                      <p className="max-w-full truncate text-center text-sm font-semibold text-primary dark:text-white">
                        {description}
                      </p>

                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-white/80 text-primary shadow-[0_12px_30px_rgba(1,75,63,0.14)] transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:shadow-[0_18px_36px_rgba(1,75,63,0.24)] dark:border-white/20 dark:bg-white/10 dark:text-secondary dark:group-hover:border-secondary dark:group-hover:shadow-[0_18px_36px_rgba(248,167,36,0.18)]">
                        <Icon
                          size={44}
                          stroke={1.6}
                          className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </a>
            ),
          )}
        </div>

        <div className="grid w-full max-w-6xl grid-cols-1 justify-items-center gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {SOCIAL_CONTACT_OPTIONS.map(
            ({ description, href, linkLabel, icon: Icon }) => (
              <a
                key={`${linkLabel}-${description}`}
                aria-label={linkLabel}
                className="group block w-full max-w-[190px] rounded-large focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                href={href}
                rel="noreferrer"
                target="_blank"
              >
                <Card className={CONTACT_CARD_CLASS} radius="lg">
                  <CardBody className={`${CONTACT_CARD_BODY_CLASS} px-3 py-5`}>
                    <div className="flex min-w-0 flex-col items-center justify-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/20 bg-white/80 text-primary shadow-[0_10px_24px_rgba(1,75,63,0.14)] transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:shadow-[0_14px_30px_rgba(1,75,63,0.22)] dark:border-white/20 dark:bg-white/10 dark:text-secondary dark:group-hover:border-secondary dark:group-hover:shadow-[0_14px_30px_rgba(248,167,36,0.16)]">
                        <Icon
                          size={34}
                          stroke={1.6}
                          className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                        />
                      </div>

                      <p className="max-w-full truncate text-center text-sm font-semibold text-primary dark:text-white">
                        {description}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </a>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;
