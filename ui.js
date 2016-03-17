(function () {

    var dropZone = document.querySelector('.dropZone');
    var filesInput = document.getElementById('files');
    var errorBlock = document.querySelector('.error');


    if (window.File && window.FileReader && window.FileList && window.Blob) {

        function displayInfo (files) {
            var output = [];
            for (var i = 0, f; f = files[i]; i++) {
              output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                          f.size, ' bytes, last modified: ',
                          f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                          '</li>');
            }
            document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
        }

        function dropHandler (evt) {
            evt.stopPropagation();
            evt.preventDefault();

            displayInfo(evt.dataTransfer.files);
            handleFileSelect(evt);
        }

        function dragOverHandler (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            evt.dataTransfer.dropEffect = 'copy';
        }

        function handleFileSelect(evt) {
            var files = (evt.dataTransfer || evt.target).files;
            displayInfo(files);

            for (var i = 0, f; f = files[i]; i++) {

              var reader = new FileReader();

              reader.onload = (function(theFile) {
                return function(e) {

                    var df = document.createDocumentFragment();
                    var pre = document.createElement('pre');
                    var title = document.createElement('h3');
                    var threadCount = document.createElement('h4');

                    var text = e.target.result;
                    var data;

                    try {
                        errorBlock.innerHTML = '';
                        data = Dump.process(text);
                        threadCount.innerText = data.length + ' thread' + (data.length != 1 && 's');
                        pre.innerText = data.map(function(item) { return item.name + ' ' + item.state; }).join('\n');
                    } catch(e) {
                        errorBlock.innerHTML = e.message;
                    }


                    title.innerHTML = escape(theFile.name);

                    df.appendChild(title);
                    df.appendChild(threadCount);
                    df.appendChild(pre);

                    document.getElementById('list').insertBefore(df, null);
                };
              })(f);

              // Read in the image file as a data URL.
              reader.readAsText(f);
            }
        }

        dropZone.addEventListener('dragover', dragOverHandler, false);
        dropZone.addEventListener('drop', dropHandler, false);

        filesInput.addEventListener('change', handleFileSelect, false);

    } else {
      alert('The File APIs are not fully supported in this browser.');
    }

})();
