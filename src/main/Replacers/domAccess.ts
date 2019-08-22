export default function(eventName: string) {
    const scriptElement: HTMLScriptElement = document.querySelector('script[src*="figma_app"]');

    // console.log('scriptElement: ', eventName, scriptElement);

    fetch(scriptElement.src)
        .then(response => response.text())
        .then(script => {
            const newScript = document.createElement('script');
            newScript.text = `console.log("${eventName} 111111111111111111111111 HUI 1111111111111111");`;
            // newScript.text = script.replace('Failed DOM access check', 'ok');

            scriptElement.remove();
            document.body.appendChild(newScript);
        })
        .catch(error => console.error('Get figma_app script error: ', error));
}
