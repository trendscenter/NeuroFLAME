// src/linkInterceptor.ts
export function setupLinkInterceptor() {
    const handleLinkClick = (event: MouseEvent) => {
        const target = (event.target as HTMLElement).closest('a');

        // Check if target is a link with an href attribute
        if (target && target.href) {
            // Optional: Add conditions to limit which links are intercepted
            const url = new URL(target.href);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
                event.preventDefault(); // Prevent default navigation

                // Open the link in a new window
                window.open(
                    target.href,
                    '_blank',
                    'width=800,height=600,left=100,top=100' // Customize as needed
                );
            }
        }
    };

    // Attach the event listener to the document
    document.addEventListener('click', handleLinkClick);

    // Return a cleanup function
    return () => document.removeEventListener('click', handleLinkClick);
}
