<?php

include "../../Shared/test.php";
include_once "../../../coursesyspw.php";

$testsData = array(
    /*This test will not work since creating an assignment is not possible since cid is missing (according to the page)
    This will lead to the DELETE query still deleting something during the test since the delete is based on id, and not on a created specific id. 
    Therefore this test will be commented out for the time being, added if the error is found.*/
    'create an assignment' => array(
        'expected-output' => '{
            "entries": [
                {
                    "variants": [
                        {
                            "vid": "1",
                            "param": "{\"tal\":\"2\"}",
                            "notes": "{\"tal\":\"2\"}",
                            "variantanswer": "{\"danswer\":\"00000010 0 2\"}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "1",
                            "cogwheelVariant": "1",
                            "trashcanVariant": "1"
                        },
                        {
                            "vid": "2",
                            "param": "{\"tal\":\"5\"}",
                            "notes": "{\"tal\":\"5\"}",
                            "variantanswer": "{\"danswer\":\"00000101 0 5\"}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "2",
                            "cogwheelVariant": "2",
                            "trashcanVariant": "2"
                        },
                        {
                            "vid": "3",
                            "param": "{\"tal\":\"10\"}",
                            "notes": "{\"tal\":\"10\"}",
                            "variantanswer": "{\"danswer\":\"00002 0 A\"}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "3",
                            "cogwheelVariant": "3",
                            "trashcanVariant": "3"
                        }
                    ],
                    "did": "1",
                    "qname": "Bitdugga1",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "dugga1",
                    "qstart": null,
                    "deadline": "2015-01-30 15:30:00",
                    "qrelease": "2015-01-01 00:00:00",
                    "modified": "2023-04-26 14:56:47",
                    "arrow": "1",
                    "cogwheel": "1",
                    "jsondeadline": "",
                    "trashcan": "1"
                },
                {
                    "variants": [
                        {
                            "vid": "4",
                            "param": "{\"tal\":\"25\"}",
                            "notes": "{\"tal\":\"25\"}",
                            "variantanswer": "{\"danswer\":\"00011001 1 9\"}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "4",
                            "cogwheelVariant": "4",
                            "trashcanVariant": "4"
                        },
                        {
                            "vid": "5",
                            "param": "{\"tal\":\"87\"}",
                            "notes": "{\"tal\":\"87\"}",
                            "variantanswer": "{\"danswer\":\"02111 5 7\"}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "5",
                            "cogwheelVariant": "5",
                            "trashcanVariant": "5"
                        },
                        {
                            "vid": "6",
                            "param": "{\"tal\":\"192\"}",
                            "notes": "{\"tal\":\"192\"}",
                            "variantanswer": "{\"danswer\":\"11000000 C 0\"}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "6",
                            "cogwheelVariant": "6",
                            "trashcanVariant": "6"
                        }
                    ],
                    "did": "2",
                    "qname": "Bitdugga2",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "dugga1",
                    "qstart": null,
                    "deadline": "2015-01-25 15:30:00",
                    "qrelease": "2015-01-08 00:00:00",
                    "modified": "2023-04-26 14:56:47",
                    "arrow": "2",
                    "cogwheel": "2",
                    "jsondeadline": "",
                    "trashcan": "2"
                },
                {
                    "variants": [
                        {
                            "vid": "7",
                            "param": "{\"color\":\"red\",\"colorname\":\"Röd\"}",
                            "notes": "{\"color\":\"red\",\"colorname\":\"Röd\"}",
                            "variantanswer": "{Variant}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "7",
                            "cogwheelVariant": "7",
                            "trashcanVariant": "7"
                        },
                        {
                            "vid": "8",
                            "param": "{\"color\":\"white\",\"colorname\":\"Vit\"}",
                            "notes": "{\"color\":\"white\",\"colorname\":\"Vit\"}",
                            "variantanswer": "{Variant}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "8",
                            "cogwheelVariant": "8",
                            "trashcanVariant": "8"
                        },
                        {
                            "vid": "9",
                            "param": "{\"color\":\"black\",\"colorname\":\"Svart\"}",
                            "notes": "{\"color\":\"black\",\"colorname\":\"Svart\"}",
                            "variantanswer": "{Variant}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "9",
                            "cogwheelVariant": "9",
                            "trashcanVariant": "9"
                        }
                    ],
                    "did": "3",
                    "qname": "colordugga1",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "dugga2",
                    "qstart": null,
                    "deadline": "2015-01-20 15:30:00",
                    "qrelease": "2015-01-01 00:00:00",
                    "modified": "2023-04-26 14:56:47",
                    "arrow": "3",
                    "cogwheel": "3",
                    "jsondeadline": "",
                    "trashcan": "3"
                },
                {
                    "variants": [
                        {
                            "vid": "10",
                            "param": "{\"color\":\"blue\",\"colorname\":\"Blå\"}",
                            "notes": "{\"color\":\"blue\",\"colorname\":\"Blå\"}",
                            "variantanswer": "{Variant}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "10",
                            "cogwheelVariant": "10",
                            "trashcanVariant": "10"
                        },
                        {
                            "vid": "11",
                            "param": "{\"color\":\"purple\",\"colorname\":\"Lila\"}",
                            "notes": "{\"color\":\"purple\",\"colorname\":\"Lila\"}",
                            "variantanswer": "{Variant}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "11",
                            "cogwheelVariant": "11",
                            "trashcanVariant": "11"
                        },
                        {
                            "vid": "12",
                            "param": "{\"color\":\"teal\",\"colorname\":\"Turkos (Teal)\"}",
                            "notes": "{\"color\":\"teal\",\"colorname\":\"Turkos (Teal)\"}",
                            "variantanswer": "{Variant}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "12",
                            "cogwheelVariant": "12",
                            "trashcanVariant": "12"
                        }
                    ],
                    "did": "4",
                    "qname": "colordugga2",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "dugga2",
                    "qstart": null,
                    "deadline": "2015-01-18 15:30:00",
                    "qrelease": "2015-01-08 00:00:00",
                    "modified": "2023-04-26 14:56:47",
                    "arrow": "4",
                    "cogwheel": "4",
                    "jsondeadline": "",
                    "trashcan": "4"
                },
                {
                    "variants": [
                        {
                            "vid": "13",
                            "param": "{\"linje\":\"10,30,19 20 40 20 50 30 50,81 65 50\"}",
                            "notes": "{\"linje\":\"10,30,19 20 40 20 50 30 50,81 65 50\"}",
                            "variantanswer": "{Variant}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "13",
                            "cogwheelVariant": "13",
                            "trashcanVariant": "13"
                        }
                    ],
                    "did": "5",
                    "qname": "linjedugga1",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "dugga3",
                    "qstart": null,
                    "deadline": "2015-02-10 15:30:00",
                    "qrelease": "2015-01-01 00:00:00",
                    "modified": "2023-04-26 14:56:47",
                    "arrow": "5",
                    "cogwheel": "5",
                    "jsondeadline": "",
                    "trashcan": "5"
                },
                {
                    "variants": [
                        {
                            "vid": "14",
                            "param": "{\"linje\":\"10,30,81 10 20,81 65 10,63 20 30 75 35,19 30 60 75 70 50 35,19 100 10 85 95 45 50,19 40 40 50 40 15 55,63 10 60 10 50,81 20 30\"}",
                            "notes": "{\"linje\":\"10,30,81 10 20,81 65 10,63 20 30 75 35,19 30 60 75 70 50 35,19 100 10 85 95 45 50,19 40 40 50 40 15 55,63 10 60 10 50,81 20 30\"}",
                            "variantanswer": "{Variant}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "14",
                            "cogwheelVariant": "14",
                            "trashcanVariant": "14"
                        }
                    ],
                    "did": "6",
                    "qname": "linjedugga2",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "dugga3",
                    "qstart": null,
                    "deadline": "2015-02-15 15:30:00",
                    "qrelease": "2015-01-01 00:00:00",
                    "modified": "2023-04-26 14:56:47",
                    "arrow": "6",
                    "cogwheel": "6",
                    "jsondeadline": "",
                    "trashcan": "6"
                },
                {
                    "variants": [
                        {
                            "vid": "15",
                            "param": "{\"variant\":\"40 13 7 20 0\"}",
                            "notes": "{\"variant\":\"40 13 7 20 0\"}",
                            "variantanswer": "{Variant}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "15",
                            "cogwheelVariant": "15",
                            "trashcanVariant": "15"
                        }
                    ],
                    "did": "7",
                    "qname": "dugga1",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "dugga4",
                    "qstart": null,
                    "deadline": "2015-02-05 15:30:00",
                    "qrelease": "2015-01-01 00:00:00",
                    "modified": "2023-04-26 14:56:47",
                    "arrow": "7",
                    "cogwheel": "7",
                    "jsondeadline": "",
                    "trashcan": "7"
                },
                {
                    "variants": [
                        {
                            "vid": "16",
                            "param": "{\"variant\":\"26 38 33 43 17 5 23 26 30 40 0 17 5 13 22 1 27 11 7 17 22 2 27 26 16 8 13 22 2 27 15 10 19 23 0\"}",
                            "notes": "{\"variant\":\"26 38 33 43 17 5 23 26 30 40 0 17 5 13 22 1 27 11 7 17 22 2 27 26 16 8 13 22 2 27 15 10 19 23 0\"}",
                            "variantanswer": "{Variant}",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "16",
                            "cogwheelVariant": "16",
                            "trashcanVariant": "16"
                        }
                    ],
                    "did": "8",
                    "qname": "dugga2",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "dugga4",
                    "qstart": null,
                    "deadline": "2015-02-20 15:30:00",
                    "qrelease": "2015-02-01 00:00:00",
                    "modified": "2023-04-26 14:56:47",
                    "arrow": "8",
                    "cogwheel": "8",
                    "jsondeadline": "",
                    "trashcan": "8"
                },
                {
                    "variants": [
                        {
                            "vid": "17",
                            "param": "{question\"One byte is equivalent to how many bits?: A\"4: B\"8: C\"16: D\"32}",
                            "notes": "{question\"One byte is equivalent to how many bits?: A\"4: B\"8: C\"16: D\"32}",
                            "variantanswer": "B",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "17",
                            "cogwheelVariant": "17",
                            "trashcanVariant": "17"
                        },
                        {
                            "vid": "18",
                            "param": "{question\"RGB and CMYK are abbreviations for what?: A\"Red, Green, Blue and Cyan Magenta, Yellow, Key (black): B\"Red, Grey, Black and Cyclone, Magenta, Yellow, Kayo: C\"Randy´s Green Brick and Cactus Magnolia Yronema Kalmia}",
                            "notes": "{question\"RGB and CMYK are abbreviations for what?: A\"Red, Green, Blue and Cyan Magenta, Yellow, Key (black): B\"Red, Grey, Black and Cyclone, Magenta, Yellow, Kayo: C\"Randy´s Green Brick and Cactus Magnolia Yronema Kalmia}",
                            "variantanswer": "A",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "18",
                            "cogwheelVariant": "18",
                            "trashcanVariant": "18"
                        },
                        {
                            "vid": "19",
                            "param": "{question\"Which of these are examples of actual shaders?: A\"B32shader, 554shader: B\"Context shaders, Shadow shaders and Block shaders: C\"Vertex shaders, Pixel shaders and Geometry shaders}",
                            "notes": "{question\"Which of these are examples of actual shaders?: A\"B32shader, 554shader: B\"Context shaders, Shadow shaders and Block shaders: C\"Vertex shaders, Pixel shaders and Geometry shaders}",
                            "variantanswer": "C",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "19",
                            "cogwheelVariant": "19",
                            "trashcanVariant": "19"
                        },
                        {
                            "vid": "20",
                            "param": "{question\"Points, lines and curves are examples of geometrical...: A\"Primitives: B\"Substitutes: C\"Formations: D\"Partitions}",
                            "notes": "{question\"Points, lines and curves are examples of geometrical...: A\"Primitives: B\"Substitutes: C\"Formations: D\"Partitions}",
                            "variantanswer": "A",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "20",
                            "cogwheelVariant": "20",
                            "trashcanVariant": "20"
                        }
                    ],
                    "did": "9",
                    "qname": "Quiz",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "kryss",
                    "qstart": null,
                    "deadline": "2015-02-19 15:30:00",
                    "qrelease": "2015-01-01 00:00:00",
                    "modified": "2023-04-26 14:56:47",
                    "arrow": "9",
                    "cogwheel": "9",
                    "jsondeadline": "",
                    "trashcan": "9"
                },
                {
                    "variants": [
                        {
                            "vid": "21",
                            "param": "{\"type\":\"md\",\"filelink\":\"minimikrav_m2.md\", \"submissions\":[{\"fieldname\":\"InlPHPDocument\",\"type\":\"pdf\",\"instruction\":\"Your report as a .pdf document.\"},{\"fieldname\":\"InlPHPZip\",\"type\":\"zip\", \"instruction\":\"Zip your project folder and submit the file here.\"}]}",
                            "notes": "{\"type\":\"md\",\"filelink\":\"minimikrav_m2.md\", \"submissions\":[{\"fieldname\":\"InlPHPDocument\",\"type\":\"pdf\",\"instruction\":\"Your report as a .pdf document.\"},{\"fieldname\":\"InlPHPZip\",\"type\":\"zip\", \"instruction\":\"Zip your project folder and submit the file here.\"}]}",
                            "variantanswer": "",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "21",
                            "cogwheelVariant": "21",
                            "trashcanVariant": "21"
                        }
                    ],
                    "did": "10",
                    "qname": "Rapport",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "generic_dugga_file_receive",
                    "qstart": null,
                    "deadline": "2015-02-19 15:30:00",
                    "qrelease": "2015-01-01 00:00:00",
                    "modified": "2023-04-26 14:56:47",
                    "arrow": "10",
                    "cogwheel": "10",
                    "jsondeadline": "",
                    "trashcan": "10"
                },
                {
                    "variants": [
                        {
                            "vid": "22",
                            "param": "{\"instructions\" : \"Målet med denna duggan är att du skall skapa den html- och css-kod som krävs för att återskapa det du ser i target-fönstret.\", \"target\" : \"cssdugga-site-1.png\", \"target-text\" : \"1) Skall tåla att storleken på skärmen påverkas. 2) Sidan får inte bli mindre i x-led än att alla knappar,Sture 1-5, i #eilert syns. 3) Endast span-element i body skall användas, Inga andra placeholder-element ellerövriga container-element är tillåtna 4) Float får ej användas 5) html och css skall klara validering 6) Internal css style skall användas\"}",
                            "notes": "{\"instructions\" : \"Målet med denna duggan är att du skall skapa den html- och css-kod som krävs för att återskapa det du ser i target-fönstret.\", \"target\" : \"cssdugga-site-1.png\", \"target-text\" : \"1) Skall tåla att storleken på skärmen påverkas. 2) Sidan får inte bli mindre i x-led än att alla knappar,Sture 1-5, i #eilert syns. 3) Endast span-element i body skall användas, Inga andra placeholder-element ellerövriga container-element är tillåtna 4) Float får ej användas 5) html och css skall klara validering 6) Internal css style skall användas\"}",
                            "variantanswer": "",
                            "modified": "2023-04-26 14:56:48",
                            "disabled": "0",
                            "arrowVariant": "22",
                            "cogwheelVariant": "22",
                            "trashcanVariant": "22"
                        }
                    ],
                    "did": "11",
                    "qname": "HTML CSS Testdugga",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "html_css_dugga",
                    "qstart": null,
                    "deadline": "2015-02-19 15:30:00",
                    "qrelease": "2015-01-01 00:00:00",
                    "modified": "2023-04-26 14:56:48",
                    "arrow": "11",
                    "cogwheel": "11",
                    "jsondeadline": "",
                    "trashcan": "11"
                },
                {
                    "variants": [
                        {
                            "vid": "23",
                            "param": "{\"target\":\"test.png\"}",
                            "notes": "{\"target\":\"test.png\"}",
                            "variantanswer": "",
                            "modified": "2023-04-26 14:56:49",
                            "disabled": "0",
                            "arrowVariant": "23",
                            "cogwheelVariant": "23",
                            "trashcanVariant": "23"
                        }
                    ],
                    "did": "12",
                    "qname": "Clipping masking testdugga",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "clipping_masking_dugga",
                    "qstart": null,
                    "deadline": "2015-02-19 15:30:00",
                    "qrelease": "2015-01-01 00:00:00",
                    "modified": "2023-04-26 14:56:48",
                    "arrow": "12",
                    "cogwheel": "12",
                    "jsondeadline": "",
                    "trashcan": "12"
                },
                {
                    "variants": [],
                    "did": "40",
                    "qname": "TestDugga1",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "dugga1",
                    "qstart": "2023-05-17",
                    "deadline": "2023-05-18 00:00:00",
                    "qrelease": "2023-05-20 00:00:00",
                    "modified": "2023-05-17 14:10:18",
                    "arrow": "40",
                    "cogwheel": "40",
                    "jsondeadline": "{\"deadline1\":\"2023-05-18 0:0\",\"comment1\":\"\",\"deadline2\":\"2023-05-18 0:0\",\"comment2\":\"\",\"deadline3\":\"2023-05-19 0:0\",\"comment3\":\"\"}",
                    "trashcan": "40"
                },
                {
                    "variants": [],
                    "did": "41",
                    "qname": "TestDugga2",
                    "autograde": "1",
                    "gradesystem": "2",
                    "quizFile": "3d-dugga",
                    "qstart": "2023-05-25",
                    "deadline": "2023-05-26 00:00:00",
                    "qrelease": "2023-05-28 00:00:00",
                    "modified": "2023-05-19 09:42:19",
                    "arrow": "41",
                    "cogwheel": "41",
                    "jsondeadline": "{\"deadline1\":\"2023-05-26 0:0\",\"comment1\":\"\",\"deadline2\":\"2023-05-26 0:0\",\"comment2\":\"\",\"deadline3\":\"2023-05-27 0:0\",\"comment3\":\"\"}",
                    "trashcan": "41"
                },
                {
                    "variants": [],
                    "did": "42",
                    "qname": "TestDugga3",
                    "autograde": "0",
                    "gradesystem": "1",
                    "quizFile": "3d-dugga",
                    "qstart": "2023-05-04",
                    "deadline": "2023-05-05 00:00:00",
                    "qrelease": "2023-05-07 00:00:00",
                    "modified": "2023-05-19 11:22:54",
                    "arrow": "42",
                    "cogwheel": "42",
                    "jsondeadline": "{\"deadline1\":\"2023-05-05 0:0\",\"comment1\":\"\",\"deadline2\":\"2023-05-05 0:0\",\"comment2\":\"\",\"deadline3\":\"2023-05-06 0:0\",\"comment3\":\"\"}",
                    "trashcan": "42"
                }
            ],
            "debug": "NONE!",
            "writeaccess": true,
            "files": [
                "3d-dugga",
                "XMLAPI_report1",
                "bit-dugga",
                "boxmodell",
                "clipping_masking_dugga",
                "color-dugga",
                "contribution",
                "curve-dugga",
                "daily-minutes",
                "diagram_dugga",
                "dugga1",
                "dugga2",
                "dugga3",
                "dugga4",
                "dugga5",
                "dugga6",
                "duggaTest",
                "feedback_dugga",
                "generic_dugga_file_receive",
                "group-assignment",
                "html_css_dugga",
                "html_css_dugga_light",
                "kryss",
                "new-assignment",
                "placeholder_dugga",
                "seminar_dugga",
                "shapes-dugga",
                "svg-dugga",
                "transforms-dugga"
            ],
            "coursecode": "IT118G",
            "coursename": "Webbutveckling - datorgrafik"
        }',
        'query-after-test-1' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'SAVDUGGA',
                'qid' => 'UNK',
                'cid' => '1885',
                'userid' => '2',
                // this is automatically added depending on what session is active (if any), we want the value to be 2
                'coursevers' => '1337',
                'qname' => 'TestQuiz',
                'autograde' => '1',
                'gradesys' => '2',
                'template' => 'Quiz',
                'jsondeadline' => '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}',
                'release' => '2023-04-27 00:00:00',
                'deadline' => '2023-04-29 00:00:00',
                'qstart' => '2023-04-17',
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(
            array(
                'none'
                /*
                // Filter what output to use in assert test, use none to use all ouput from service
                'LastCourseCreated' => array(

                ),
                'entries' => array(
                    'cid',
                    'coursename',
                    'coursecode',
                    'visibility',
                    'activeversion',
                    'activeedversion',
                    'registered'
                ),
                'versions' => array(
                    'cid',
                    'coursecode',
                    'vers',
                    'versname',
                    'coursename',
                    'coursenamealt'
                ),
                'debug',
                'writeaccess',
                'motd',
                'readonly'*/
            )
        ),
    ),
    
    /*
    'update an assignment' => array(
        'expected-output' => '{
            "entries": [
            {
                "variants": [
                    {
                        "vid": "1",
                        "param": "{\"tal\":\"2\"}",
                        "notes": "{\"tal\":\"2\"}",
                        "variantanswer": "{\"danswer\":\"00000010 0 2\"}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "1",
                        "cogwheelVariant": "1",
                        "trashcanVariant": "1"
                    },
                    {
                        "vid": "2",
                        "param": "{\"tal\":\"5\"}",
                        "notes": "{\"tal\":\"5\"}",
                        "variantanswer": "{\"danswer\":\"00000101 0 5\"}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "2",
                        "cogwheelVariant": "2",
                        "trashcanVariant": "2"
                    },
                    {
                        "vid": "3",
                        "param": "{\"tal\":\"10\"}",
                        "notes": "{\"tal\":\"10\"}",
                        "variantanswer": "{\"danswer\":\"00002 0 A\"}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "3",
                        "cogwheelVariant": "3",
                        "trashcanVariant": "3"
                    }
                ],
                "did": "1",
                "qname": "Bitdugga1",
                "autograde": "1",
                "gradesystem": "2",
                "quizFile": "dugga1",
                "qstart": null,
                "deadline": "2015-01-30 15:30:00",
                "qrelease": "2015-01-01 00:00:00",
                "modified": "2023-04-26 14:56:47",
                "arrow": "1",
                "cogwheel": "1",
                "jsondeadline": "",
                "trashcan": "1"
            },
            {
                "variants": [
                    {
                        "vid": "4",
                        "param": "{\"tal\":\"25\"}",
                        "notes": "{\"tal\":\"25\"}",
                        "variantanswer": "{\"danswer\":\"00011001 1 9\"}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "4",
                        "cogwheelVariant": "4",
                        "trashcanVariant": "4"
                    },
                    {
                        "vid": "5",
                        "param": "{\"tal\":\"87\"}",
                        "notes": "{\"tal\":\"87\"}",
                        "variantanswer": "{\"danswer\":\"02111 5 7\"}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "5",
                        "cogwheelVariant": "5",
                        "trashcanVariant": "5"
                    },
                    {
                        "vid": "6",
                        "param": "{\"tal\":\"192\"}",
                        "notes": "{\"tal\":\"192\"}",
                        "variantanswer": "{\"danswer\":\"11000000 C 0\"}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "6",
                        "cogwheelVariant": "6",
                        "trashcanVariant": "6"
                    }
                ],
                "did": "2",
                "qname": "Bitdugga2",
                "autograde": "1",
                "gradesystem": "2",
                "quizFile": "dugga1",
                "qstart": null,
                "deadline": "2015-01-25 15:30:00",
                "qrelease": "2015-01-08 00:00:00",
                "modified": "2023-04-26 14:56:47",
                "arrow": "2",
                "cogwheel": "2",
                "jsondeadline": "",
                "trashcan": "2"
            },
            {
                "variants": [
                    {
                        "vid": "7",
                        "param": "{\"color\":\"red\",\"colorname\":\"Röd\"}",
                        "notes": "{\"color\":\"red\",\"colorname\":\"Röd\"}",
                        "variantanswer": "{Variant}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "7",
                        "cogwheelVariant": "7",
                        "trashcanVariant": "7"
                    },
                    {
                        "vid": "8",
                        "param": "{\"color\":\"white\",\"colorname\":\"Vit\"}",
                        "notes": "{\"color\":\"white\",\"colorname\":\"Vit\"}",
                        "variantanswer": "{Variant}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "8",
                        "cogwheelVariant": "8",
                        "trashcanVariant": "8"
                    },
                    {
                        "vid": "9",
                        "param": "{\"color\":\"black\",\"colorname\":\"Svart\"}",
                        "notes": "{\"color\":\"black\",\"colorname\":\"Svart\"}",
                        "variantanswer": "{Variant}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "9",
                        "cogwheelVariant": "9",
                        "trashcanVariant": "9"
                    }
                ],
                "did": "3",
                "qname": "colordugga1",
                "autograde": "1",
                "gradesystem": "2",
                "quizFile": "dugga2",
                "qstart": null,
                "deadline": "2015-01-20 15:30:00",
                "qrelease": "2015-01-01 00:00:00",
                "modified": "2023-04-26 14:56:47",
                "arrow": "3",
                "cogwheel": "3",
                "jsondeadline": "",
                "trashcan": "3"
            },
            {
                "variants": [
                    {
                        "vid": "10",
                        "param": "{\"color\":\"blue\",\"colorname\":\"Blå\"}",
                        "notes": "{\"color\":\"blue\",\"colorname\":\"Blå\"}",
                        "variantanswer": "{Variant}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "10",
                        "cogwheelVariant": "10",
                        "trashcanVariant": "10"
                    },
                    {
                        "vid": "11",
                        "param": "{\"color\":\"purple\",\"colorname\":\"Lila\"}",
                        "notes": "{\"color\":\"purple\",\"colorname\":\"Lila\"}",
                        "variantanswer": "{Variant}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "11",
                        "cogwheelVariant": "11",
                        "trashcanVariant": "11"
                    },
                    {
                        "vid": "12",
                        "param": "{\"color\":\"teal\",\"colorname\":\"Turkos (Teal)\"}",
                        "notes": "{\"color\":\"teal\",\"colorname\":\"Turkos (Teal)\"}",
                        "variantanswer": "{Variant}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "12",
                        "cogwheelVariant": "12",
                        "trashcanVariant": "12"
                    }
                ],
                "did": "4",
                "qname": "colordugga2",
                "autograde": "1",
                "gradesystem": "2",
                "quizFile": "dugga2",
                "qstart": null,
                "deadline": "2015-01-18 15:30:00",
                "qrelease": "2015-01-08 00:00:00",
                "modified": "2023-04-26 14:56:47",
                "arrow": "4",
                "cogwheel": "4",
                "jsondeadline": "",
                "trashcan": "4"
            },
            {
                "variants": [
                    {
                        "vid": "13",
                        "param": "{\"linje\":\"10,30,19 20 40 20 50 30 50,81 65 50\"}",
                        "notes": "{\"linje\":\"10,30,19 20 40 20 50 30 50,81 65 50\"}",
                        "variantanswer": "{Variant}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "13",
                        "cogwheelVariant": "13",
                        "trashcanVariant": "13"
                    }
                ],
                "did": "5",
                "qname": "linjedugga1",
                "autograde": "1",
                "gradesystem": "2",
                "quizFile": "dugga3",
                "qstart": null,
                "deadline": "2015-02-10 15:30:00",
                "qrelease": "2015-01-01 00:00:00",
                "modified": "2023-04-26 14:56:47",
                "arrow": "5",
                "cogwheel": "5",
                "jsondeadline": "",
                "trashcan": "5"
            },
            {
                "variants": [
                    {
                        "vid": "14",
                        "param": "{\"linje\":\"10,30,81 10 20,81 65 10,63 20 30 75 35,19 30 60 75 70 50 35,19 100 10 85 95 45 50,19 40 40 50 40 15 55,63 10 60 10 50,81 20 30\"}",
                        "notes": "{\"linje\":\"10,30,81 10 20,81 65 10,63 20 30 75 35,19 30 60 75 70 50 35,19 100 10 85 95 45 50,19 40 40 50 40 15 55,63 10 60 10 50,81 20 30\"}",
                        "variantanswer": "{Variant}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "14",
                        "cogwheelVariant": "14",
                        "trashcanVariant": "14"
                    }
                ],
                "did": "6",
                "qname": "linjedugga2",
                "autograde": "1",
                "gradesystem": "2",
                "quizFile": "dugga3",
                "qstart": null,
                "deadline": "2015-02-15 15:30:00",
                "qrelease": "2015-01-01 00:00:00",
                "modified": "2023-04-26 14:56:47",
                "arrow": "6",
                "cogwheel": "6",
                "jsondeadline": "",
                "trashcan": "6"
            },
            {
                "variants": [
                    {
                        "vid": "15",
                        "param": "{\"variant\":\"40 13 7 20 0\"}",
                        "notes": "{\"variant\":\"40 13 7 20 0\"}",
                        "variantanswer": "{Variant}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "15",
                        "cogwheelVariant": "15",
                        "trashcanVariant": "15"
                    }
                ],
                "did": "7",
                "qname": "dugga1",
                "autograde": "1",
                "gradesystem": "2",
                "quizFile": "dugga4",
                "qstart": null,
                "deadline": "2015-02-05 15:30:00",
                "qrelease": "2015-01-01 00:00:00",
                "modified": "2023-04-26 14:56:47",
                "arrow": "7",
                "cogwheel": "7",
                "jsondeadline": "",
                "trashcan": "7"
            },
            {
                "variants": [
                    {
                        "vid": "16",
                        "param": "{\"variant\":\"26 38 33 43 17 5 23 26 30 40 0 17 5 13 22 1 27 11 7 17 22 2 27 26 16 8 13 22 2 27 15 10 19 23 0\"}",
                        "notes": "{\"variant\":\"26 38 33 43 17 5 23 26 30 40 0 17 5 13 22 1 27 11 7 17 22 2 27 26 16 8 13 22 2 27 15 10 19 23 0\"}",
                        "variantanswer": "{Variant}",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "16",
                        "cogwheelVariant": "16",
                        "trashcanVariant": "16"
                    }
                ],
                "did": "8",
                "qname": "dugga2",
                "autograde": "1",
                "gradesystem": "2",
                "quizFile": "dugga4",
                "qstart": null,
                "deadline": "2015-02-20 15:30:00",
                "qrelease": "2015-02-01 00:00:00",
                "modified": "2023-04-26 14:56:47",
                "arrow": "8",
                "cogwheel": "8",
                "jsondeadline": "",
                "trashcan": "8"
            },
            {
                "variants": [
                    {
                        "vid": "17",
                        "param": "{question\"One byte is equivalent to how many bits?: A\"4: B\"8: C\"16: D\"32}",
                        "notes": "{question\"One byte is equivalent to how many bits?: A\"4: B\"8: C\"16: D\"32}",
                        "variantanswer": "B",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "17",
                        "cogwheelVariant": "17",
                        "trashcanVariant": "17"
                    },
                    {
                        "vid": "18",
                        "param": "{question\"RGB and CMYK are abbreviations for what?: A\"Red, Green, Blue and Cyan Magenta, Yellow, Key (black): B\"Red, Grey, Black and Cyclone, Magenta, Yellow, Kayo: C\"Randy´s Green Brick and Cactus Magnolia Yronema Kalmia}",
                        "notes": "{question\"RGB and CMYK are abbreviations for what?: A\"Red, Green, Blue and Cyan Magenta, Yellow, Key (black): B\"Red, Grey, Black and Cyclone, Magenta, Yellow, Kayo: C\"Randy´s Green Brick and Cactus Magnolia Yronema Kalmia}",
                        "variantanswer": "A",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "18",
                        "cogwheelVariant": "18",
                        "trashcanVariant": "18"
                    },
                    {
                        "vid": "19",
                        "param": "{question\"Which of these are examples of actual shaders?: A\"B32shader, 554shader: B\"Context shaders, Shadow shaders and Block shaders: C\"Vertex shaders, Pixel shaders and Geometry shaders}",
                        "notes": "{question\"Which of these are examples of actual shaders?: A\"B32shader, 554shader: B\"Context shaders, Shadow shaders and Block shaders: C\"Vertex shaders, Pixel shaders and Geometry shaders}",
                        "variantanswer": "C",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "19",
                        "cogwheelVariant": "19",
                        "trashcanVariant": "19"
                    },
                    {
                        "vid": "20",
                        "param": "{question\"Points, lines and curves are examples of geometrical...: A\"Primitives: B\"Substitutes: C\"Formations: D\"Partitions}",
                        "notes": "{question\"Points, lines and curves are examples of geometrical...: A\"Primitives: B\"Substitutes: C\"Formations: D\"Partitions}",
                        "variantanswer": "A",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "20",
                        "cogwheelVariant": "20",
                        "trashcanVariant": "20"
                    }
                ],
                "did": "9",
                "qname": "Quiz",
                "autograde": "1",
                "gradesystem": "2",
                "quizFile": "kryss",
                "qstart": null,
                "deadline": "2015-02-19 15:30:00",
                "qrelease": "2015-01-01 00:00:00",
                "modified": "2023-04-26 14:56:47",
                "arrow": "9",
                "cogwheel": "9",
                "jsondeadline": "",
                "trashcan": "9"
            },
            {
                "variants": [
                    {
                        "vid": "21",
                        "param": "{\"type\":\"md\",\"filelink\":\"minimikrav_m2.md\", \"submissions\":[{\"fieldname\":\"InlPHPDocument\",\"type\":\"pdf\",\"instruction\":\"Your report as a .pdf document.\"},{\"fieldname\":\"InlPHPZip\",\"type\":\"zip\", \"instruction\":\"Zip your project folder and submit the file here.\"}]}",
                        "notes": "{\"type\":\"md\",\"filelink\":\"minimikrav_m2.md\", \"submissions\":[{\"fieldname\":\"InlPHPDocument\",\"type\":\"pdf\",\"instruction\":\"Your report as a .pdf document.\"},{\"fieldname\":\"InlPHPZip\",\"type\":\"zip\", \"instruction\":\"Zip your project folder and submit the file here.\"}]}",
                        "variantanswer": "",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "21",
                        "cogwheelVariant": "21",
                        "trashcanVariant": "21"
                    }
                ],
                "did": "10",
                "qname": "Rapport",
                "autograde": "1",
                "gradesystem": "2",
                "quizFile": "generic_dugga_file_receive",
                "qstart": null,
                "deadline": "2015-02-19 15:30:00",
                "qrelease": "2015-01-01 00:00:00",
                "modified": "2023-04-26 14:56:47",
                "arrow": "10",
                "cogwheel": "10",
                "jsondeadline": "",
                "trashcan": "10"
            },
            {
                "variants": [
                    {
                        "vid": "22",
                        "param": "{\"instructions\" : \"Målet med denna duggan är att du skall skapa den html- och css-kod som krävs för att återskapa det du ser i target-fönstret.\", \"target\" : \"cssdugga-site-1.png\", \"target-text\" : \"1) Skall tåla att storleken på skärmen påverkas. 2) Sidan får inte bli mindre i x-led än att alla knappar,Sture 1-5, i #eilert syns. 3) Endast span-element i body skall användas, Inga andra placeholder-element ellerövriga container-element är tillåtna 4) Float får ej användas 5) html och css skall klara validering 6) Internal css style skall användas\"}",
                        "notes": "{\"instructions\" : \"Målet med denna duggan är att du skall skapa den html- och css-kod som krävs för att återskapa det du ser i target-fönstret.\", \"target\" : \"cssdugga-site-1.png\", \"target-text\" : \"1) Skall tåla att storleken på skärmen påverkas. 2) Sidan får inte bli mindre i x-led än att alla knappar,Sture 1-5, i #eilert syns. 3) Endast span-element i body skall användas, Inga andra placeholder-element ellerövriga container-element är tillåtna 4) Float får ej användas 5) html och css skall klara validering 6) Internal css style skall användas\"}",
                        "variantanswer": "",
                        "modified": "2023-04-26 14:56:48",
                        "disabled": "0",
                        "arrowVariant": "22",
                        "cogwheelVariant": "22",
                        "trashcanVariant": "22"
                    }
                ],
                "did": "11",
                "qname": "HTML CSS Testdugga",
                "autograde": "1",
                "gradesystem": "2",
                "quizFile": "html_css_dugga",
                "qstart": null,
                "deadline": "2015-02-19 15:30:00",
                "qrelease": "2015-01-01 00:00:00",
                "modified": "2023-04-26 14:56:48",
                "arrow": "11",
                "cogwheel": "11",
                "jsondeadline": "",
                "trashcan": "11"
            },
            {
                "variants": [
                    {
                        "vid": "23",
                        "param": "{\"target\":\"test.png\"}",
                        "notes": "{\"target\":\"test.png\"}",
                        "variantanswer": "",
                        "modified": "2023-04-26 14:56:49",
                        "disabled": "0",
                        "arrowVariant": "23",
                        "cogwheelVariant": "23",
                        "trashcanVariant": "23"
                    }
                ],
                "did": "12",
                "qname": "Clipping masking testdugga",
                "autograde": "1",
                "gradesystem": "2",
                "quizFile": "clipping_masking_dugga",
                "qstart": null,
                "deadline": "2015-02-19 15:30:00",
                "qrelease": "2015-01-01 00:00:00",
                "modified": "2023-04-26 14:56:48",
                "arrow": "12",
                "cogwheel": "12",
                "jsondeadline": "",
                "trashcan": "12"
            },
            {
                "variants": [],
                "did": "40",
                "qname": "TestDugga1",
                "autograde": "1",
                "gradesystem": "2",
                "quizFile": "dugga1",
                "qstart": "2023-05-17",
                "deadline": "2023-05-18 00:00:00",
                "qrelease": "2023-05-20 00:00:00",
                "modified": "2023-05-17 14:10:18",
                "arrow": "40",
                "cogwheel": "40",
                "jsondeadline": "{\"deadline1\":\"2023-05-18 0:0\",\"comment1\":\"\",\"deadline2\":\"2023-05-18 0:0\",\"comment2\":\"\",\"deadline3\":\"2023-05-19 0:0\",\"comment3\":\"\"}",
                "trashcan": "40"
            }
        ],
        "debug": "NONE!",
        "writeaccess": true,
        "files": [
            "3d-dugga",
            "XMLAPI_report1",
            "bit-dugga",
            "boxmodell",
            "clipping_masking_dugga",
            "color-dugga",
            "contribution",
            "curve-dugga",
            "daily-minutes",
            "diagram_dugga",
            "dugga1",
            "dugga2",
            "dugga3",
            "dugga4",
            "dugga5",
            "dugga6",
            "duggaTest",
            "feedback_dugga",
            "generic_dugga_file_receive",
            "group-assignment",
            "html_css_dugga",
            "html_css_dugga_light",
            "kryss",
            "new-assignment",
            "placeholder_dugga",
            "seminar_dugga",
            "shapes-dugga",
            "svg-dugga",
            "transforms-dugga"
        ],
        "coursecode": "IT118G",
        "coursename": "Webbutveckling - datorgrafik"
                ],
                "coursecode": "Coursecode not found!",
                "coursename": "Course not Found!"}',
        'query-before-test-1' => "INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
         VALUES (1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-29 00:00:00', 2, '1337', '2023-04-17', '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}', 0);",
        'query-after-test-1' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'SAVDUGGA',
                'qid' => 'NULL',
                'name' => 'UpdatedAutomaticTest',
                'autograde' => '1',
                'gradesys' => '2',
                'template' => 'group-assignment',
                'jsondeadline' => '{&quot;deadline1&quot;:&quot;2023-04-30 0:0&quot;;&quot;comment1&quot;:&quot;&quot;;&quot;deadline2&quot;:&quot;&quot;;&quot;comment2&quot;:&quot;&quot;;&quot;deadline3&quot;:&quot;&quot;;&quot;comment3&quot;:&quot;&quot;}',
                'groupAssignment' => '1',
                'release' => '2023-04-28 00:00:00',
                'deadline' => '2023-04-30 00:00:00',
                'qstart' => '2023-04-18',
                'username' => '2',
                'password' => 'Kong'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'LastCourseCreated' => array(

                ),
                'entries' => array(
                    'cid',
                    'coursename',
                    'coursecode',
                    'visibility',
                    'activeversion',
                    'activeedversion',
                    'registered'
                ),
                'versions' => array(
                    'cid',
                    'coursecode',
                    'vers',
                    'versname',
                    'coursename',
                    'coursenamealt'
                ),
                'debug',
                'writeaccess',
                'motd',
                'readonly'
            )
        ),
    ),

    'delete an assignment' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
        VALUES (1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-29 00:00:00', 2, '1337', '2023-04-17', '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}', 0);",
        'query-before-test-2' => "SELECT MAX(id) FROM quiz",
        'query-after-test-1' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'DELDU',
                'qid' => '<!query-before-test-2!> <*[0][quiz]*>',
                'username' => 'toddler',
                'password' => 'Kong'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'readonly'
            )
        ),
    ),

    'add variant' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "INSERT INTO quiz (cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,group) VALUES(1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-28 00:00:00', 2, '1337', '2023-04-17', '{&quot,deadline1&quot,:&quot,2023-04-27 0:0&quot,,&quot,comment1&quot,:&quot,&quot,,&quot,deadline2&quot,:&quot,&quot,,&quot,comment2&quot,:&quot,&quot,,&quot,deadline3&quot,:&quot,&quot,,&quot,comment3&quot,:&quot,&quot,}', 0);",
        'query-before-test-2' => "SELECT MAX(id) FROM quiz",
        'query-after-test-1' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1;",
        'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'ADDVARI',
                'username' => 'toddler',
                'password' => 'Kong',
                'qid' => '<!query-before-test-2!> <*[0][quiz]*>',
                'userid' => '2',
                'disabled' => '1',
                'param' => '{"type":"md","filelink":"md","gType":"","diagram_File":"Empty canvas","diagram_type":{"ER":true,"UML":false,"IE":false},"extraparam":"","notes":"","submissions":[{"type":"pdf","fieldname":"","instruction":""}],"errorActive":false}',
                'answer' => 'Bara Text'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'readonly'
            )
        ),
    ),

    'update a variant' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) 
        VALUES (1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-28 00:00:00', 2, '1337', '2023-04-17', '{&quot;deadline1&quot;:&quot;2023-04-27 0:0&quot;,&quot;comment1&quot;:&quot;&quot;,&quot;deadline2&quot;:&quot;&quot;,&quot;comment2&quot;:&quot;&quot;,&quot;deadline3&quot;:&quot;&quot;,&quot;comment3&quot;:&quot;&quot;}', 0);",
        'query-before-test-2' => "SELECT MAX(id) FROM quiz",
        'variables-query-before-test-3' => "id",
        'query-before-test-3' => "INSERT INTO variant(?,creator,disabled,param,variantanswer) 
        VALUES ('?', 2, 0, '{&quot;type&quot;:&quot;md&quot;,&quot;filelink&quot;:&quot;md&quot;,&quot;gType&quot;:&quot;&quot;,&quot;diagram_File&quot;:&quot;Empty canvas&quot;,&quot;diagram_type&quot;:{&quot;ER&quot;:true,&quot;UML&quot;:false,&quot;IE&quot;:false},&quot;extraparam&quot;:&quot;&quot;,&quot;notes&quot;:&quot;&quot;,&quot;submissions&quot;:[{&quot;type&quot;:&quot;pdf&quot;,&quot;fieldname&quot;:&quot;&quot;,&quot;instruction&quot;:&quot;&quot;}],&quot;errorActive&quot;:false}', 'some text')",
        'query-before-test-4' => "SELECT MAX(vid) FROM variant",
        'query-after-test-1' => "DELETE FROM quiz ORDER BY id DESC LIMIT 1",
        'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'SAVVARI',
                'id' => '<!query-before-test-2!> <*[0][quiz]*>',
                'vid' => '<!query-before-test-4!> <*[0][variant]*>',
                'disabled' => '1',
                'param' => '{"type":"md","filelink":"","gType":"md","gFilelink":"","diagram_File":"","diagram_type":{"ER":true,"UML":false,"IE":false},"extraparam":"","notes":"","submissions":[{"type":"pdf","fieldname":"","instruction":""},{"type":"pdf","fieldname":"","instruction":""}],"errorActive":false}',
                'answer' => 'new text',
                'username' => 'toddler',
                'password' => 'Kong'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'readonly'
            )
        ),
    ),

    'create course test' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "INSERT INTO quiz (cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) VALUES(1885, 0, 1, 'AutomaticTest', 'Quiz', '2023-04-27 00:00:00', '2023-04-28 00:00:00', 2, '1337', '2023-04-17', '{&quot,deadline1&quot,:&quot,2023-04-27 0:0&quot,,&quot,comment1&quot,:&quot,&quot,,&quot,deadline2&quot,:&quot,&quot,,&quot,comment2&quot,:&quot,&quot,,&quot,deadline3&quot,:&quot,&quot,,&quot,comment3&quot,:&quot,&quot,}', 0);",
        'query-before-test-2' => "SELECT MAX(id) from quiz",
        'query-before-test-3' => "INSERT INTO listentries(cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,feedbackenabled,feedbackquestion) VALUES(1885, 'Inserttobedeleted', 'UNK', 4, 12, 2, 1, 1337, 5019, 1, 1, 0, 'UNK');",
        'query-before-test-4' => "SELECT MAX(moment) from listentries",
        'variables-query-before-test-5' => "id",
        'query-before-test-5' => "INSERT INTO variant(quizID,creator,disabled,param,variantanswer) VALUES(?, 2, 0, '{&quot,type&quot,:&quot,md&quot,,&quot,filelink&quot,:&quot,md&quot,,&quot,gType&quot,:&quot,&quot,,&quot,diagram_File&quot,:&quot,Empty canvas&quot,,&quot,diagram_type&quot,:{&quot,ER&quot,:true,&quot,UML&quot,:false,&quot,IE&quot,:false},&quot,extraparam&quot,:&quot,&quot,,&quot,notes&quot,:&quot,&quot,,&quot,submissions&quot,:[{&quot,type&quot,:&quot,pdf&quot,,&quot,fieldname&quot,:&quot,&quot,,&quot,instruction&quot,:&quot,&quot,}],&quot,errorActive&quot,:false}', 'some text');",
        'query-before-test-6' => "SELECT MAX(vid) from variant",
        'variables-query-before-test-7' => "moment, id, vid",
        'query-before-test-7' => "INSERT INTO userAnswer(cid,moment,quiz,variant) VALUES(1885, ?, ?, ?);",
        'query-after-test-1' => "DELETE FROM variant ORDER BY quizID DESC LIMIT 1;",
        'query-after-test-2' => "DELETE FROM listentries WHERE cid = 1885;",
        'query-after-test-3' => "DELETE FROM quiz ORDER BY ?;",
        'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/duggaedservice.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'DELVARI',
                'username' => 'toddler',
                'password' => 'Kong',
                'id' => '<!query-before-test-2!> <*[0][quiz]*>',
                'moment' => '<!query-before-test-4!> <*[0][listentries]*>',
                'vid' => '<!query-before-test-6!> <*[0][variant]*>'
            )
        ),
        'filter-output' => serialize(
            array(
                // Filter what output to use in assert test, use none to use all ouput from service
                'debug',
                'readonly'
            )
        ),
    ),
*/

);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON