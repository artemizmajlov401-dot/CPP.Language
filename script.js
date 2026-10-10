document.addEventListener("DOMContentLoaded", function () {

    /* ============================================================
       ПОДСВЕТКА C++ — своя, безопасная
       ============================================================ */

    var KW1 = [
        "int","double","float","char","bool","void","long","short",
        "unsigned","signed","const","static","auto","struct","class",
        "public","private","protected","new","delete","return",
        "true","false","nullptr","sizeof","template","typename",
        "namespace","using","this"
    ];

    var KW2 = [
        "if","else","for","while","do","switch","case","default",
        "break","continue","try","catch","throw","goto"
    ];

    var TYPES = [
        "string","vector","map","set","stack","queue","pair",
        "cout","cin","endl","cerr",
        "sort","reverse","begin","end","push_back","top","front",
        "pop","push","empty","insert","find","next_permutation",
        "setw","INT_MIN","INT_MAX",
        "iostream","iomanip","climits","cstdlib","ctime","fstream",
        "ofstream","ifstream","algorithm"
    ];

    function escapeHTML(s) {
        return s
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function highlight(code) {
        var out = escapeHTML(code);

        out = out.replace(/(\/\/[^\n]*)/g, "\u0001COM$1\u0002");
        out = out.replace(/(#\w+)/g, "\u0001PRE$1\u0002");
        out = out.replace(/(&quot;[^&\n]*?&quot;)/g, "\u0001STR$1\u0002");
        out = out.replace(/\b(\d+)\b/g, "\u0001NUM$1\u0002");

        TYPES.slice().sort(function(a,b){return b.length-a.length;}).forEach(function(t){
            var re = new RegExp("\\b" + t + "\\b", "g");
            out = out.replace(re, "\u0001TYP" + t + "\u0002");
        });

        KW2.forEach(function(k){
            var re = new RegExp("\\b" + k + "\\b", "g");
            out = out.replace(re, "\u0001KW2" + k + "\u0002");
        });

        KW1.forEach(function(k){
            var re = new RegExp("\\b" + k + "\\b", "g");
            out = out.replace(re, "\u0001KW1" + k + "\u0002");
        });

        out = out.replace(/\b([A-Za-z_]\w*)(\s*\()/g, function(m, name, paren){
            if (KW1.indexOf(name) !== -1) return m;
            if (KW2.indexOf(name) !== -1) return m;
            return "\u0001FN" + name + "\u0002" + paren;
        });

        out = out.replace(/\u0001COM([^\u0002]*)\u0002/g, '<span class="com">$1</span>');
        out = out.replace(/\u0001PRE([^\u0002]*)\u0002/g, '<span class="pre">$1</span>');
        out = out.replace(/\u0001STR([^\u0002]*)\u0002/g, '<span class="str">$1</span>');
        out = out.replace(/\u0001NUM([^\u0002]*)\u0002/g, '<span class="num">$1</span>');
        out = out.replace(/\u0001TYP([^\u0002]*)\u0002/g, '<span class="type">$1</span>');
        out = out.replace(/\u0001KW2([^\u0002]*)\u0002/g, '<span class="kw-2">$1</span>');
        out = out.replace(/\u0001KW1([^\u0002]*)\u0002/g, '<span class="kw">$1</span>');
        out = out.replace(/\u0001FN([^\u0002]*)\u0002/g, '<span class="fn">$1</span>');

        return out;
    }

    // Подсветка статических блоков <pre><code>
    var staticBlocks = document.querySelectorAll("pre code");
    for (var s = 0; s < staticBlocks.length; s++) {
        staticBlocks[s].innerHTML = highlight(staticBlocks[s].textContent);
    }

    /* ============================================================
       НАВИГАЦИЯ
       ============================================================ */
    var pages = document.querySelectorAll(".page");
    var navBtns = document.querySelectorAll(".nav-btn");
    var switchBtns = document.querySelectorAll(".btn-start, .btn-next");

    function showPage(id) {
        var i;
        for (i = 0; i < pages.length; i++) pages[i].classList.remove("active");
        for (i = 0; i < navBtns.length; i++) navBtns[i].classList.remove("active");

        var page = document.getElementById(id);
        if (page) page.classList.add("active");

        var btn = document.querySelector('.nav-btn[data-page="' + id + '"]');
        if (btn) btn.classList.add("active");

        window.scrollTo(0, 0);
    }

    for (var n = 0; n < navBtns.length; n++) {
        navBtns[n].addEventListener("click", function () {
            showPage(this.dataset.page);
        });
    }
    for (var b = 0; b < switchBtns.length; b++) {
        switchBtns[b].addEventListener("click", function () {
            showPage(this.dataset.page);
        });
    }
    showPage("home");

    /* ============================================================
       СЛОВАРЬ ПОДСКАЗОК
       ============================================================
       Каждая подсказка — это полноценный C++ шаблон.
       Многострочные вставляются со всеми скобками и переносами.
       ============================================================ */
    var DICTIONARY = [
        // --- Каркас программы ---
        {
            trigger: "#include",
            insert: "#include <iostream>\n\n",
            desc: "подключить ввод-вывод"
        },
        {
            trigger: "int main",
            insert: "int main() {\n    \n    return 0;\n}\n",
            desc: "главная функция (полный каркас)"
        },

        // --- Вывод и ввод ---
        {
            trigger: "cout",
            insert: 'std::cout << "" << std::endl;\n',
            desc: "вывод строки на экран"
        },
        {
            trigger: "cout",
            insert: 'std::cout << "" ;\n',
            desc: "вывод без переноса строки"
        },
        {
            trigger: "cin",
            insert: "std::cin >> ;\n",
            desc: "ввод с клавиатуры"
        },
        {
            trigger: "endl",
            insert: "std::endl",
            desc: "перенос строки"
        },

        // --- Типы переменных ---
        {
            trigger: "int",
            insert: "int  = 0;",
            desc: "целое число"
        },
        {
            trigger: "double",
            insert: "double  = 0.0;",
            desc: "дробное число"
        },
        {
            trigger: "char",
            insert: "char  = '';",
            desc: "один символ"
        },
        {
            trigger: "bool",
            insert: "bool  = true;",
            desc: "правда / ложь"
        },
        {
            trigger: "string",
            insert: 'std::string  = "";',
            desc: "строка текста"
        },

        // --- Условия ---
        {
            trigger: "if",
            insert: "if () {\n    \n}\n",
            desc: "условие"
        },
        {
            trigger: "if else",
            insert: "if () {\n    \n} else {\n    \n}\n",
            desc: "если / иначе"
        },
        {
            trigger: "else if",
            insert: "else if () {\n    \n}\n",
            desc: "иначе если"
        },

        // --- Циклы ---
        {
            trigger: "for",
            insert: "for (int i = 0; i < n; i++) {\n    \n}\n",
            desc: "цикл for от 0 до n"
        },
        {
            trigger: "for",
            insert: "for (int i = 1; i <= n; i++) {\n    \n}\n",
            desc: "цикл for от 1 до n"
        },
        {
            trigger: "while",
            insert: "while () {\n    \n}\n",
            desc: "цикл while"
        },
        {
            trigger: "do while",
            insert: "do {\n    \n} while ();\n",
            desc: "цикл do-while"
        },
        {
            trigger: "break",
            insert: "break;",
            desc: "выйти из цикла"
        },
        {
            trigger: "continue",
            insert: "continue;",
            desc: "пропустить круг"
        },

        // --- Функции ---
        {
            trigger: "void",
            insert: "void () {\n    \n}\n",
            desc: "функция без возврата"
        },
        {
            trigger: "return",
            insert: "return ;",
            desc: "вернуть значение"
        },

        // --- Массивы ---
        {
            trigger: "int array",
            insert: "int [] = {};\n",
            desc: "массив чисел"
        },

        // --- STL ---
        {
            trigger: "#include vector",
            insert: "#include <vector>\n",
            desc: "подключить вектор"
        },
        {
            trigger: "vector",
            insert: "std::vector<int> v;\n",
            desc: "динамический массив"
        },
        {
            trigger: "sort",
            insert: "std::sort(v.begin(), v.end());\n",
            desc: "отсортировать"
        },
        {
            trigger: "reverse",
            insert: "std::reverse(v.begin(), v.end());\n",
            desc: "развернуть"
        },

        // --- Методы ---
        {
            trigger: "push_back",
            insert: "push_back();",
            desc: "добавить в конец"
        },
        {
            trigger: "size",
            insert: "size()",
            desc: "размер"
        },
        {
            trigger: "insert",
            insert: "insert();",
            desc: "вставить элемент"
        },
        {
            trigger: "top",
            insert: "top()",
            desc: "верхний элемент стека"
        },
        {
            trigger: "pop",
            insert: "pop();",
            desc: "удалить верхний"
        },
        {
            trigger: "push",
            insert: "push();",
            desc: "добавить в стек / очередь"
        },
        {
            trigger: "front",
            insert: "front()",
            desc: "первый элемент"
        },

        // --- Память ---
        {
            trigger: "new",
            insert: "new int[10];",
            desc: "выделить память"
        },
        {
            trigger: "delete",
            insert: "delete[] ;",
            desc: "освободить память"
        }
    ];

    function getLastWord(text) {
        var m = text.match(/[#A-Za-z_][A-Za-z0-9_:.]*$/);
        return m ? m[0] : "";
    }

    /* ============================================================
       РЕДАКТОРЫ
       ============================================================ */
    var editors = document.querySelectorAll(".editor");

    for (var e = 0; e < editors.length; e++) {
        (function (ed) {
            var textarea = ed.querySelector("textarea");
            var hl = ed.querySelector(".highlight-layer");
            var suggestions = ed.querySelector(".suggestions");
            var runBtn = ed.querySelector(".run-btn");
            var resetBtn = ed.querySelector(".reset-btn");
            var output = ed.querySelector(".output");

            var checkList = (ed.getAttribute("data-check") || "")
                .split(",")
                .map(function(s){ return s.trim(); })
                .filter(Boolean);
            var expected = ed.getAttribute("data-output") || "";

            /* --- Подсветка при наборе --- */
            function syncHighlight() {
                hl.innerHTML = highlight(textarea.value) + "\n";
                hl.scrollTop = textarea.scrollTop;
                hl.scrollLeft = textarea.scrollLeft;
            }
            syncHighlight();

            textarea.addEventListener("input", function () {
                syncHighlight();
                updateSuggestions();
            });

            textarea.addEventListener("scroll", function () {
                hl.scrollTop = textarea.scrollTop;
                hl.scrollLeft = textarea.scrollLeft;
            });

            /* --- Автодополнение --- */
            var activeIndex = -1;
            var currentSuggestions = [];

            function updateSuggestions() {
                var before = textarea.value.slice(0, textarea.selectionStart);
                var word = getLastWord(before);

                if (word.length < 1) {
                    suggestions.classList.remove("visible");
                    currentSuggestions = [];
                    return;
                }

                var lower = word.toLowerCase();
                currentSuggestions = DICTIONARY.filter(function (item) {
                    return item.trigger.toLowerCase().indexOf(lower) !== -1;
                }).slice(0, 8);

                if (currentSuggestions.length === 0) {
                    suggestions.classList.remove("visible");
                    return;
                }

                // В списке показываем триггер, а вставляем — insert
                suggestions.innerHTML = currentSuggestions.map(function (item, i) {
                    var preview = item.insert.split("\n")[0];
                    return '<div class="suggestion' + (i === 0 ? ' active' : '') + '" data-i="' + i + '">' +
                        '<span>' + escapeHTML(preview) + '</span>' +
                        '<span class="desc">' + item.desc + '</span>' +
                        '</div>';
                }).join("");

                suggestions.classList.add("visible");
                activeIndex = 0;

                var items = suggestions.querySelectorAll(".suggestion");
                items.forEach(function (el) {
                    el.addEventListener("mousedown", function (ev) {
                        ev.preventDefault();
                        applySuggestion(currentSuggestions[parseInt(el.dataset.i, 10)]);
                    });
                });
            }

            function applySuggestion(item) {
                if (!item) return;

                var value = textarea.value;
                var pos = textarea.selectionStart;
                var before = value.slice(0, pos);
                var after = value.slice(pos);

                // Стираем последнее слово целиком (триггер)
                var word = getLastWord(before);
                before = before.slice(0, before.length - word.length);

                var insertText = item.insert;
                textarea.value = before + insertText + after;

                // Ставим курсор внутрь шаблона
                var cursorOffset;
                if (insertText.indexOf("    ") !== -1) {
                    // Есть пустая строка с отступом — курсор туда
                    cursorOffset = insertText.indexOf("    ") + 4;
                } else if (insertText.indexOf("()") !== -1) {
                    // Пустые скобки — курсор в них
                    cursorOffset = insertText.indexOf("()") + 1;
                } else if (insertText.indexOf('""') !== -1) {
                    // Пустые кавычки — курсор внутрь
                    cursorOffset = insertText.indexOf('""') + 1;
                } else if (insertText.indexOf(" = ") !== -1 && insertText.indexOf(";") !== -1) {
                    // Объявление переменной — курсор перед = (для имени)
                    cursorOffset = insertText.indexOf(" = ");
                } else if (insertText.indexOf("()") !== -1) {
                    cursorOffset = insertText.indexOf("()") + 1;
                } else {
                    cursorOffset = insertText.length;
                }

                var newPos = before.length + cursorOffset;
                textarea.setSelectionRange(newPos, newPos);
                textarea.focus();

                suggestions.classList.remove("visible");
                syncHighlight();
            }

            textarea.addEventListener("keydown", function (ev) {
                // Tab — автодополнение или обычная вставка 4 пробелов
                if (ev.key === "Tab" && !suggestions.classList.contains("visible")) {
                    ev.preventDefault();
                    var value = textarea.value;
                    var start = textarea.selectionStart;
                    var end = textarea.selectionEnd;
                    textarea.value = value.slice(0, start) + "    " + value.slice(end);
                    textarea.setSelectionRange(start + 4, start + 4);
                    syncHighlight();
                    return;
                }

                if (!suggestions.classList.contains("visible")) return;

                if (ev.key === "Tab" || (ev.key === "Enter" && activeIndex !== -1)) {
                    ev.preventDefault();
                    applySuggestion(currentSuggestions[activeIndex]);
                    return;
                }

                if (ev.key === "Escape") {
                    suggestions.classList.remove("visible");
                    return;
                }

                if (ev.key === "ArrowDown") {
                    ev.preventDefault();
                    activeIndex = Math.min(activeIndex + 1, currentSuggestions.length - 1);
                    refreshActive();
                } else if (ev.key === "ArrowUp") {
                    ev.preventDefault();
                    activeIndex = Math.max(activeIndex - 1, 0);
                    refreshActive();
                }
            });

            function refreshActive() {
                var items = suggestions.querySelectorAll(".suggestion");
                items.forEach(function (el, i) {
                    if (i === activeIndex) el.classList.add("active");
                    else el.classList.remove("active");
                });
            }

            /* --- Кнопки --- */
            if (resetBtn) {
                resetBtn.addEventListener("click", function () {
                    textarea.value = "";
                    syncHighlight();
                    suggestions.classList.remove("visible");
                    output.textContent = "Очищено.";
                    output.classList.remove("ok", "err");
                });
            }

            runBtn.addEventListener("click", function () {
                var code = textarea.value;

                if (!code.trim()) {
                    output.classList.remove("ok");
                    output.classList.add("err");
                    output.textContent = "Ты ещё ничего не написал. Напиши код и попробуй снова.";
                    return;
                }

                var missing = [];
                for (var i = 0; i < checkList.length; i++) {
                    var needle = checkList[i]
                        .replace(/&lt;/g, "<")
                        .replace(/&gt;/g, ">")
                        .replace(/&amp;/g, "&")
                        .replace(/&quot;/g, '"');

                    if (code.indexOf(needle) === -1) {
                        missing.push(needle);
                    }
                }

                if (missing.length === 0) {
                    output.classList.remove("err");
                    output.classList.add("ok");
                    output.textContent =
                        "ПРАВИЛЬНО!\n\n" +
                        "Все нужные команды найдены в твоём коде.\n\n" +
                        "── Что должна вывести программа ──\n\n" +
                        expected;
                } else {
                    output.classList.remove("ok");
                    output.classList.add("err");
                    output.textContent =
                        "ОШИБКА. Не найдено в твоём коде:\n\n" +
                        missing.map(function(m){ return "  ✗ " + m; }).join("\n") +
                        "\n\nПроверь, что эти команды написаны точно так, как показано в уроке.";
                }
            });
        })(editors[e]);
    }
});