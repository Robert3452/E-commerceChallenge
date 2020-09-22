import app from './server';
import './database';

function main() {
    app.listen(app.get('port'), () => {
        console.log(`server on http://localhost:${app.get('port')}`)
    })
}

main();