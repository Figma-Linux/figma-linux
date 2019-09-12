export function isSameCookieDomain(cookieDomain: string, hostname: string): boolean {
    if (cookieDomain.length === 0) {
        return false;
	}

    const domainParts = cookieDomain.split('.');
    const hostnameParts = hostname.split('.');

	while (hostnameParts.length > 0) {
        let domainPart = domainParts.pop();
		let hostnamePart = hostnameParts.pop();

        if (domainPart === '') {
            return true;
        } else if (domainPart !== hostnamePart) {
            return false;
        }
	}

    return true;
}

